import { Router } from 'express';
import { MusicBrainzApi } from 'musicbrainz-api';

export const route = Router();
const mb = new MusicBrainzApi({
  appName: 'muslib-server',
  appVersion: '0.1',
  appMail: 'mihalenko.w.a@gmail.com'
});

route.get('/search/artist', async (req, res) => {
  try {
    const artistName = req.query.name;
    const list = await mb.searchArtist(artistName);
    const artists = [];
    for (let i = 0; i < list.artists.length; i++) {
      const match = list.artists[i];
      if (match.id) {
        artists.push({id: match.id, name: match.name});
      }
    }
    res.json({ artists: artists });
  } catch (err) {
    res.sendStatus(500);
  }
});
