<script setup>
import { reactive } from 'vue'
import userService from './services/user'
import tournamentService from './services/tournament'
import gameService from './services/game'
import playerService from './services/player'

const app = reactive({
  games: [],
  tournaments: [],
  user: null,
  modal: null,
  name: '',
  contact: '',
  load: false
})

function getGame(gameId) {
  return app.games.find(game => game.id === gameId)
}

function getDate(dateFormat) {
  const date = new Date(dateFormat)
  return date.toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })
}

async function handleSubmit(tournamentId) {
  app.load = tournamentId

  if (!app.user.id) {
    const players = await playerService.addWithTournament({
      name: app.name,
      contact: app.contact,
      tournamentId: app.modal.id
    })

    app.user.id = players[0].id
    app.user.tournaments = players[0].fields.Tournois
    userService.set(app.user)
  } else {
    const player = await playerService.getById(app.user.id)
    player.fields.Tournois.push(tournamentId)
    delete player.createdTime
    const players = await playerService.set(player)
    console.log(player, players)
  }

  app.tournaments.find(tournament => tournament.id === tournamentId).fields.Joueurs.push(app.user.id)
  app.load = false
  app.modal = null
}

async function init() {
  app.user = userService.get()
  app.games = await gameService.getAll()
  app.tournaments = await tournamentService.getAll()
  console.log(app.user)
}

init()
</script>

<template>
  <section class="tournaments_app">
    <div class="container">
      <h2 class="title has-text-light has-text-centered">Tournois</h2>
      <ul v-if="app.tournaments.length">
        <li v-for="tournament in app.tournaments">
          <figure>
            <img
              :src="getGame(tournament.fields.Jeu[0]).fields.Image[0].thumbnails.large.url"
              :alt="'Image ' + getGame(tournament.fields.Jeu[0]).fields.Nom"
            />
          </figure>
          <div class="data">
            <h3 class="has-text-weight-semibold">{{ getGame(tournament.fields.Jeu[0]).fields.Nom }}</h3>
            <h4>{{ getDate(tournament.fields.Date) }}</h4>
            <p class="console">{{ getGame(tournament.fields.Jeu[0]).fields.Console }} • {{ tournament.fields.Tarif }}€</p>
            <p class="players">{{ tournament.fields.Joueurs.length }} participants</p>
            <button
              v-if="tournament.fields.Joueurs.find(player => player === app.user.id)"
              class="button is-medium is-dark has-text-weight-semibold" disabled
            >Enregistré</button>
            <button
              v-else-if="app.user.id"
              @click="handleSubmit(tournament.id)"
              :class="app.load === tournament.id  ? 'is-loading' : ''"
              class="button is-medium is-dark has-text-weight-semibold"
              >S'inscrire</button>
            <button
              v-else
              @click="app.modal = tournament"
              class="button is-medium is-dark has-text-weight-semibold"
            >S'inscrire</button>
          </div>
        </li>
      </ul>
      <ul v-else class="placeholder">
        <li v-for="placeholder in 4">
          <figure>
            <div class="picture" itemscope></div>
          </figure>
          <div class="data">
            <div class="title" itemscope></div>
            <div class="content" itemscope></div>
            <div class="action" itemscope></div>
          </div>
        </li>
      </ul>
      <div v-if="app.modal" class="modal is-active">
        <div @click="app.modal = null" class="modal-background"></div>
        <div class="modal-content">
          <form @submit.prevent="handleSubmit(app.modal.id)" method="post" class="modal-card-body">
            <h5 class="has-text-dark has-text-weight-semibold">{{ getGame(app.modal.fields.Jeu[0]).fields.Nom }}</h5>
            <input
              v-model="app.name"
              type="text"
              placeholder="Nom prénom 🙂" class="input is-medium"
              maxlength="255"
              required
            />
            <input
              v-model="app.contact"
              type="text"
              placeholder="Email ou téléphone 📞" class="input is-medium"
              maxlength="255"
              required
            />
            <button
              :class="app.load ? 'is-loading' : ''"
              class="button is-medium is-dark has-text-weight-semibold"
            >Envoyer</button>
          </form>
        </div>
        <button @click="app.modal = null" class="modal-close is-large" aria-label="close"></button>
      </div>
    </div>
  </section>
</template>