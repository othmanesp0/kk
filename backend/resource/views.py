import os
from rest_framework import viewsets, permissions, parsers, status, filters
from rest_framework.response import Response
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from .models import Resource
from .serializers import ResourceSerializer
from .permissions import IsInstructor, IsEnrolledStudent
from azure.storage.blob import BlobServiceClient


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'upload_date']

    def get_queryset(self):
        queryset = Resource.objects.all()
        module_id = self.request.query_params.get('module')
        if module_id is not None:
            queryset = queryset.filter(module_id=module_id)
        return queryset

    def perform_create(self, serializer):
        try:
            file = serializer.validated_data.get('file')
            
            # Validate file extensions
            validator = FileExtensionValidator(allowed_extensions=['pdf'])
            validator(file)
            
            # Validate file size (limit to 5MB)
            if file.size > 5 * 1024 * 1024:
                raise ValidationError("File size exceeds the limit (5MB).")

            # Upload the file to Azure Blob Storage
            blob_service_client = BlobServiceClient.from_connection_string(os.environ.get('AZURE_STORAGE_CONNECTION_STRING'))
            blob_client = blob_service_client.get_blob_client(container=os.environ.get('AZURE_STORAGE_CONTAINER_NAME'), blob=file.name)
            blob_client.upload_blob(file, overwrite=True)

            # Update the file field with the Azure Blob Storage URL
            serializer.instance.file = blob_client.url
            serializer.save(module_id=self.kwargs.get('module_pk'), uploaded_by=self.request.user)

        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'An error occurred during upload: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        file = request.data.get('file')
        if file:
            try:
                if file.size > 5 * 1024 * 1024:
                    raise ValidationError("File size exceeds the limit (5MB).")
                if not file.content_type.startswith('application/pdf'):
                    raise ValidationError("Only PDF files are allowed.")
            except ValidationError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.module.course.instructor != request.user:
            return Response({'detail': 'You are not authorized to update this resource.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.module.course.instructor != request.user:
            return Response({'detail': 'You are not authorized to delete this resource.'}, status=status.HTTP_403_FORBIDDEN)
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
