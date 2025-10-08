/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { shallowMount } from '@vue/test-utils'
import AppsMenu from '../lib/view/AppsMenu.vue'
import { loadState } from '@nextcloud/initial-state'
import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import * as loggerModule from '../lib/logger.ts'

// Mock the modules
jest.mock('@nextcloud/initial-state')
jest.mock('@nextcloud/event-bus')

describe('AppsMenu.vue', () => {
	const mockApps = [
		{
			id: 'files',
			name: 'Files',
			href: '/apps/files',
			icon: '/apps/files/img/app.svg',
			active: false,
			target: undefined,
		},
		{
			id: 'calendar',
			name: 'Calendar',
			href: '/apps/calendar',
			icon: '/apps/calendar/img/app.svg',
			active: true,
			target: undefined,
		},
		{
			id: 'external-site',
			name: 'External Site',
			href: 'https://example.com',
			icon: '/apps/external/img/app.svg',
			active: false,
			target: '_blank',
		},
	]

	beforeEach(() => {
		jest.clearAllMocks()
		;(loadState as jest.Mock).mockReturnValue(mockApps)
	})

	it('renders correctly with apps list', () => {
		const wrapper = shallowMount(AppsMenu)

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.ncwappsmenu').exists()).toBe(true)
		expect(wrapper.find('.ncwappsmenu__grid').exists()).toBe(true)
	})

	it('loads apps from initial state', () => {
		const wrapper = shallowMount(AppsMenu)

		expect(loadState).toHaveBeenCalledWith('core', 'apps', [])
		expect((wrapper.vm as unknown as { appsList: unknown[] }).appsList).toEqual(mockApps)
	})

	it('renders app items correctly', () => {
		const wrapper = shallowMount(AppsMenu)

		const appItems = wrapper.findAll('.ncwappsmenu__app-item')
		expect(appItems).toHaveLength(mockApps.length)

		// Check first app item
		const firstApp = appItems.at(0)
		const firstAppLink = firstApp.find('.ncwappsmenu__app-icon')

		expect(firstAppLink.attributes('href')).toBe(mockApps[0].href)
		expect(firstAppLink.attributes('title')).toBe(mockApps[0].name)
		expect(firstAppLink.attributes('aria-current')).toBeUndefined()
		expect(firstAppLink.attributes('target')).toBeUndefined()
		expect(firstAppLink.attributes('rel')).toBeUndefined()

		const firstAppImage = firstApp.find('.ncwappsmenu__app-image')
		expect(firstAppImage.attributes('src')).toBe(mockApps[0].icon)
		expect(firstAppImage.attributes('alt')).toBe(mockApps[0].name)

		const firstAppName = firstApp.find('.ncwappsmenu__app-name')
		expect(firstAppName.text()).toBe(mockApps[0].name)
	})

	it('handles active app correctly', () => {
		const wrapper = shallowMount(AppsMenu)

		const appItems = wrapper.findAll('.ncwappsmenu__app-item')
		const activeApp = appItems.at(1) // calendar app is active
		const activeAppLink = activeApp.find('.ncwappsmenu__app-icon')

		expect(activeAppLink.attributes('aria-current')).toBe('page')
	})

	it('handles external apps with target="_blank" correctly', () => {
		const wrapper = shallowMount(AppsMenu)

		const appItems = wrapper.findAll('.ncwappsmenu__app-item')
		const externalApp = appItems.at(2) // external site app
		const externalAppLink = externalApp.find('.ncwappsmenu__app-icon')

		expect(externalAppLink.attributes('target')).toBe('_blank')
		expect(externalAppLink.attributes('rel')).toBe('noopener noreferrer')
	})

	it('subscribes to event bus on mount', () => {
		shallowMount(AppsMenu)

		expect(subscribe).toHaveBeenCalledWith('nextcloud:app-menu.refresh', expect.any(Function))
	})

	it('unsubscribes from event bus on destroy', () => {
		const wrapper = shallowMount(AppsMenu)

		wrapper.destroy()

		expect(unsubscribe).toHaveBeenCalledWith('nextcloud:app-menu.refresh', expect.any(Function))
	})

	it('handles handleOpen method', async () => {
		const loggerSpy = jest.spyOn(loggerModule.logger, 'info').mockImplementation()
		const wrapper = shallowMount(AppsMenu)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).handleOpen()

		expect(loggerSpy).toHaveBeenCalledWith('Apps menu opened')
		loggerSpy.mockRestore()
	})
})
