/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue from 'vue'
import { waitContainerObserver } from '../lib/dom'

// Mock the DOM utilities
jest.mock('../lib/dom')

// Mock Vue with proper typing
const mockVueInstance = {
	$mount: jest.fn(),
	$destroy: jest.fn(),
}

const mockVueConstructor: jest.MockedClass<typeof Vue> = jest.fn().mockImplementation((options) => ({
	...mockVueInstance,
	...options,
})) as any
mockVueConstructor.mixin = jest.fn()

jest.mock('vue', () => mockVueConstructor)

// Mock the AppsMenu component
jest.mock('../lib/view/AppsMenu.vue', () => ({
	name: 'AppsMenu',
	template: '<div class="mock-apps-menu" />',
}))

describe('main.ts initialization', () => {
	let mockWaitContainerObserver: jest.MockedFunction<typeof waitContainerObserver>

	beforeEach(() => {
		jest.clearAllMocks()

		// Reset DOM
		document.body.innerHTML = ''

		// Setup DOM structure
		const header = document.createElement('div')
		header.id = 'header'

		const appMenu = document.createElement('div')
		appMenu.className = 'app-menu'
		header.appendChild(appMenu)

		const userMenu = document.createElement('div')
		userMenu.id = 'user-menu'
		header.appendChild(userMenu)

		document.body.appendChild(header)

		mockWaitContainerObserver = waitContainerObserver as jest.MockedFunction<typeof waitContainerObserver>
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('removes original apps menu successfully', async () => {
		const mockElement = { remove: jest.fn() }
		mockWaitContainerObserver.mockResolvedValue(mockElement as unknown as HTMLElement)

		// Import and run the initialization
		await import('../main')

		expect(mockWaitContainerObserver).toHaveBeenCalledWith('#header .app-menu')
		expect(mockElement.remove).toHaveBeenCalled()
	})

	it('handles error when removing original apps menu fails', async () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
		mockWaitContainerObserver.mockRejectedValue(new Error('Element not found'))

		// Import and run the initialization
		await import('../main')

		expect(consoleSpy).toHaveBeenCalledWith('Failed to remove original apps menu:', expect.any(Error))
		consoleSpy.mockRestore()
	})
})
