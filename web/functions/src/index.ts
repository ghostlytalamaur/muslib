import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Without credentials. Triggers already have sufficient credentials
const app = admin.initializeApp();

export const onDeleteArtist = functions.firestore.document('users/{userId}/artists/{artistId}').onDelete((snapshot, context) => {
  // console.log('onDeleteArtist executed. snapshot:', snapshot, 'context:', context);
  const id = snapshot.id;
  const userId = context.params.userId;
  const bucket = app.storage().bucket();
  return bucket
    .deleteFiles({prefix: `users/${userId}/artists/${id}`});
});
