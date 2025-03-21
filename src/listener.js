import autoBind from 'auto-bind';

export default class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString(),
      );

      const playlist =
        await this._playlistsService.getSongsInPlaylist(playlistId);
      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlist),
      );
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
}
