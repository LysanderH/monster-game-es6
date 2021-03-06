import * as settings from './settings'
import state from './state'
import ui from './ui'

const game = {
  init () {
    ui.init()
    ui.controlsDiv.addEventListener('click', this.dispatchAction)
  },
  dispatchAction (e) {
    switch (e.target.id) {
      case settings.START_NEW_GAME_BUTTON_ID:
        game.startNewGame()
        break
      case settings.ATTACK['button-id']:
        game.attack(settings.ATTACK)
        break
      case settings.SPECIAL_ATTACK['button-id']:
        game.attack(settings.SPECIAL_ATTACK)
        break
      case settings.HEAL['button-id']:
        game.heal()
        break
      case settings.GIVE_UP_BUTTON_ID:
        game.giveUp()
        break
    }
  },
  getRandomValue (typeOfAction) {
    switch (typeOfAction) {
      case settings.ATTACK.type:
        return Math.floor(Math.random() * settings.ATTACK['max-impact'])
      case settings.SPECIAL_ATTACK.type:
        return Math.floor(Math.random() * settings.SPECIAL_ATTACK['max-impact'])
      case settings.HEAL.type:
        return Math.ceil(Math.random() * settings.HEAL['max-impact'])
      default :
        console.error(`${typeOfAction} n’est pas un type d’action autorisé pour obtenir un nombre aléatoire`)
    }
  },
  startNewGame () {
    state.status = settings.IN_GAME_STATUS
    ui.buildControlsNodes()
  },
  giveUp () {
    state.reset()
    ui.reset()
  },
  attack (type) {
    state.opponents.forEach(opponent => {
      const damage = this.getRandomValue(type.type)
      opponent.healthValue += damage
      state.addMessageToLog(type.message(opponent, damage))
    })
    if (state.losers.length === 0) {
      ui.updateAfterAction()
    } else {
      if (ui.buildDefeatModal()) {
        this.giveUp()
      } else {
        ui.controlsDiv.removeEventListener('click', this.dispatchAction)
      }
    }
  },
  heal () {
    if (state.healCount < settings.MAX_HEAL_ACTION) {
      state.opponents.forEach(opponent => {
        const damage = this.getRandomValue(settings.HEAL.type)
        if (opponent.healthValue + damage <= settings.HEALTH_MAX_VALUE) {
          opponent.healthValue += damage
          state.addMessageToLog(settings.HEAL.message(opponent, damage))
        } else {
          opponent.healthValue = settings.HEALTH_MAX_VALUE
          state.addMessageToLog(`${opponent.name} est au maximum de santé`)
        }
      })
      state.healCount++
    } else {
      state.addMessageToLog(`Vous avez épuisé toutes les réserves de soins`)
    }
    ui.updateAfterAction()
  }
}

game.init()
