/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue from 'vue'
import { config } from '@vue/test-utils'

// Mock Nextcloud modules
jest.mock('@nextcloud/l10n', () => ({
	t: jest.fn((app, key) => key),
	n: jest.fn((app, key) => key),
}))

jest.mock('@nextcloud/initial-state', () => ({
	loadState: jest.fn(() => []),
}))

jest.mock('@nextcloud/event-bus', () => ({
	subscribe: jest.fn(),
	unsubscribe: jest.fn(),
}))

// Mock Vue Material Design Icons
jest.mock('vue-material-design-icons/Apps.vue', () => ({
	name: 'Apps',
	template: '<div class="mock-apps-icon" />',
}))

// Mock Nextcloud Vue components
jest.mock('@nextcloud/vue/dist/Components/NcHeaderMenu.js', () => ({
	name: 'NcHeaderMenu',
	template: '<div class="mock-nc-header-menu"><slot name="trigger" /><slot /></div>',
	props: ['id', 'class', 'is-nav', 'aria-label'],
}))

// Global Vue configuration for tests
Vue.config.productionTip = false

// Configure Vue Test Utils for Vue 2.x
config.mocks = {
	t: jest.fn((app, key) => key),
	n: jest.fn((app, key) => key),
}

// Mock console methods to reduce noise in tests
global.console = {
	...console,
	debug: jest.fn(),
	log: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
}
