import Vue from 'vue'
import App from './App.vue'
import { waitContainerObserver } from './lib/dom.js'

Vue.mixin({methods: {t, n}})

const View = Vue.extend(App)

waitContainerObserver('#header .app-menu').then((container) => {
	console.log('foo', container);

	container.remove()

	const menu =  document.createElement('div');
	menu.id = 'ncw_apps_menu-container'

	const headerEnd = document.querySelector('#header .header-end')

	if (headerEnd) {
		headerEnd.appendChild(menu)
		new View().$mount('#ncw_apps_menu-container')
	}
})
