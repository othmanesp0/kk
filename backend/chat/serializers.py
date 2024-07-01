from rest_framework import serializers
from google.cloud import firestore
from google.cloud.firestore import SERVER_TIMESTAMP
from rest_framework import serializers


class ChatRoomSerializer(serializers.Serializer):
    """
    Serializer for ChatRoom model.

    This serializer is used to serialize and deserialize ChatRoom objects.
    """

    id = serializers.CharField(read_only=True)  # ID generated by Firestore
    name = serializers.CharField(max_length=255)
    chat_type = serializers.ChoiceField(choices=[('private', 'Private'), ('course', 'Course')]) 
    course = serializers.IntegerField(required=False, allow_null=True)  # Will store the course ID

    def validate(self, data):
        """
        Check that course ID is provided for course type chat rooms.

        This method is used to validate the data before saving the ChatRoom object.
        It checks if the chat_type is 'course' and if the course ID is provided.
        If the chat_type is 'course' and the course ID is not provided, it raises a validation error.

        Args:
            data (dict): The data to be validated.

        Returns:
            dict: The validated data.

        Raises:
            serializers.ValidationError: If the chat_type is 'course' and the course ID is not provided.
        """
        if data['chat_type'] == 'course' and not data.get('course'):
            raise serializers.ValidationError("Course ID is required for course type chat rooms.")
        return data


class ChatMessageSerializer(serializers.Serializer):
    """
    Serializer for chat messages.

    This serializer is used to validate and serialize chat messages.
    It defines the fields and their validation rules for the chat message model.
    """

    id = serializers.CharField(read_only=True)
    chat_room_id = serializers.CharField() 
    sender = serializers.CharField(max_length=255)
    message = serializers.CharField()
    timestamp = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        """
        Save a new chat message to Firestore with a server-generated timestamp.

        Args:
            validated_data (dict): The validated data for the chat message.

        Returns:
            dict: The serialized chat message data with the generated ID.
        """
        db = firestore.Client()
        chat_message_ref = db.collection('chat_messages').document()
        validated_data['timestamp'] = SERVER_TIMESTAMP
        chat_message_ref.set(validated_data)
        return {'id': chat_message_ref.id, **validated_data}