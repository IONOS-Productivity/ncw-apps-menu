/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const waitContainerObserver = (selector: string): Promise<Element> => {
	return new Promise((resolve) => {
		const existing = document.querySelector(selector)
		if (existing) {
			resolve(existing)
			return
		}

		const observer = new MutationObserver(() => {
			const element = document.querySelector(selector)
			if (element) {
				observer.disconnect()
				resolve(element)
			}
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true
		})
	})
}

export { waitContainerObserver }
