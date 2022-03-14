import apiConfig from '../config/api'

const tournamentPath = '/Tournois'

const tournamentService = {
  async getAll() {
    try {
      const tournaments = await fetch(
        apiConfig.getUrl(tournamentPath),
        apiConfig.getSettings('GET')
      )
      const { records } = await tournaments.json()
      return records
    } catch (error) {
      console.error(error)
      return []
    }
  }
}

export default tournamentService