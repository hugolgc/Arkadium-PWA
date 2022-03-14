import apiConfig from '../config/api'

const playerPath = '/Joueurs'

const playerService = {
  async getById(id) {
    try {
      const player = await fetch(
        apiConfig.getUrl(playerPath + '/' + id),
        apiConfig.getSettings('GET')
      )
      return await player.json()
    } catch (error) {
      console.error(error)
      return []
    }
  },
  async addWithTournament({ name, contact, tournamentId }) {
    try {
      const players = await fetch(
        apiConfig.getUrl(playerPath),
        apiConfig.getSettings('POST', { records: [{
          fields: {
            Nom: name,
            Contact: contact,
            Tournois: [tournamentId]
          }}]
        })
      )
      const { records } = await players.json()
      return records
    } catch (error) {
      console.error(error)
      return null
    }
  },
  async set(player) {
    try {
      const players = await fetch(
        apiConfig.getUrl(playerPath),
        apiConfig.getSettings('PATCH', { records: [player] })
      )
      const { records } = await players.json()
      return records
    } catch (error) {
      return null
    }
  }
}

export default playerService