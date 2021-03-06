import Vue from 'vue'
import Router from 'vue-router'
import Home from './Views/Home/Home.vue'
import Game from './Views/Game/Game.vue'
import GameOver from './Views/GameOver/GameOver.vue'
import Options from './Views/Options/Options.vue'
import PianoSettings from './Views/PianoSettings/PianoSettings.vue'
import MidiHelp from './Views/Help/MidiHelp.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/play',
      name: 'play',
      component: Game
    },
    {
      path: '/options',
      name: 'options',
      component: Options
    },
    {
      path: '/over',
      name: 'gameover',
      component: GameOver
    },
    {
      path: '/midihelp',
      name: 'midihelp',
      component: MidiHelp
    },
    {
      path: '/options/notes',
      name: 'notesinterval',
      component: PianoSettings
    },
    {
      path: '/options/piano',
      name: 'pianosettings',
      component: PianoSettings
    }
  ],
})
