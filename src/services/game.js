import apiConfig from '../config/api'

const gamePath = '/Jeux'

const gameService = {
  async getAll() {
    try {
      const games = await fetch(
        apiConfig.getUrl(gamePath),
        apiConfig.getSettings('GET')
      )
      const { records } = await games.json()
      return records
    } catch (error) {
      console.error(error)
      return []
    }
  }
}

export default gameService