import pg from 'pg';

const { Pool } = pg;

export default class PlaylistsServices {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsInPlaylist(playlistId) {
    const playlistQuery = {
      text: 'SELECT playlists.id, playlists.name FROM playlists WHERE playlists.id = $1',
      values: [playlistId],
    };

    const playlist = await this._pool.query(playlistQuery);

    const songsQuery = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId],
    };

    const songs = await this._pool.query(songsQuery);

    return {
      playlist: {
        ...playlist.rows[0],
        songs: songs.rows,
      },
    };
  }
}
