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
    const artists = list.artists.map(match => {
      return {
        id: match.id,
        name: match.name
      };
    });
    res.json({ artists: artists });
  } catch (err) {
    res.sendStatus(500);
  }
});
