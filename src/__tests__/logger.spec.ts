/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { logger } from '../lib/logger.ts'

describe('ncw_apps_menu: logger', () => {
	// Rest of the logger is not under our responsibility but nextcloud-logger
	it('has correct app name set up', () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

		logger.error('<message>')

		expect(consoleSpy).toHaveBeenCalledTimes(1)
		expect(consoleSpy).toHaveBeenCalledWith('[ERROR] ncw_apps_menu: <message>', { app: 'ncw_apps_menu', level: 2 })

		consoleSpy.mockRestore()
	})
})
