/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
import AppsMenu from './lib/view/AppsMenu.vue'
import { waitContainerObserver } from './lib/dom'
import { t, n } from '@nextcloud/l10n'

Vue.mixin({methods: {t, n}})

waitContainerObserver('#header .app-menu').then((container: Element) => {
	console.log('foo', container);

	container.remove()

	const mountPoint = document.createElement('div');
	mountPoint.id = 'ncw_apps_menu-container'

	const headerEnd = document.querySelector('#header .header-end')

	if (headerEnd) {
		headerEnd.appendChild(mountPoint)
		new Vue({
			name: 'AppsMenuRoot',
			el: mountPoint,
			render: h => h(AppsMenu),
		})
	}
})
