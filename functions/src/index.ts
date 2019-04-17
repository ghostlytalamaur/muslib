import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Without credentials. Triggers already have sufficient credentials
const app = admin.initializeApp();

export const onDeleteArtist = functions.firestore.document('artists/{artistId}').onDelete((snapshot, context) => {
  const id = snapshot.id;
  const bucket = app.storage().bucket();
  return bucket
    .deleteFiles({prefix: `artists/${id}`});
});
