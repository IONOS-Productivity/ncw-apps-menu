/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
import AppsMenu from './lib/view/AppsMenu.vue'
import { waitContainerObserver } from './lib/dom'
import { t, n } from '@nextcloud/l10n'

// Configure Vue with global mixins
Vue.mixin({ methods: { t, n } })

/**
 * Remove the original Nextcloud apps menu from the header
 */
async function removeOriginalAppsMenu(): Promise<void> {
	try {
		const container = await waitContainerObserver('#header .app-menu')
		container.remove()
		console.debug('Original apps menu removed successfully')
	} catch (error) {
		console.error('Failed to remove original apps menu:', error)
	}
}

/**
 * Create and configure the mount point for the custom apps menu
 */
function createMountPoint(): HTMLDivElement {
	const mountPoint = document.createElement('div')
	mountPoint.id = 'ncw_apps_menu-container'
	return mountPoint
}

/**
 * Find the user menu element in the header
 */
function findUserMenu(): Element | null {
	const userMenu = document.querySelector('#header #user-menu')
	if (!userMenu) {
		console.warn('User menu not found in header')
		return null
	}
	return userMenu
}

/**
 * Mount the Vue application with the custom apps menu
 * @param mountPoint - The DOM element to mount the Vue app to
 */
function mountAppsMenu(mountPoint: HTMLElement): Vue | null {
	try {
		/* eslint-disable-next-line no-new */
		return new Vue({
			name: 'AppsMenuRoot',
			el: mountPoint,
			render: h => h(AppsMenu),
		})
	} catch (error) {
		console.error('Failed to mount apps menu:', error)
		return null
	}
}

/**
 * Initialize the custom apps menu by replacing the original one
 */
function initializeAppsMenu(): void {
	const userMenu = findUserMenu()

	if (!userMenu?.parentNode) {
		console.error('Cannot initialize apps menu: user menu or its parent not found')
		return
	}

	const mountPoint = createMountPoint()

	// Insert the mount point before the user menu
	userMenu.parentNode.insertBefore(mountPoint, userMenu)

	// Mount the Vue application
	const vueInstance = mountAppsMenu(mountPoint)

	if (vueInstance) {
		console.debug('Custom apps menu initialized successfully')
	} else {
		console.error('Failed to initialize custom apps menu')
		// Clean up the mount point if Vue mounting failed
		mountPoint.remove()
	}
}

// Initialize the application
async function init(): Promise<void> {
	// Remove the original apps menu first
	await removeOriginalAppsMenu()

	// Initialize our custom apps menu
	initializeAppsMenu()
}

// Start the application
init().catch(error => {
	console.error('Failed to initialize ncw_apps_menu:', error)
})
