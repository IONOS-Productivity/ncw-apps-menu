/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { waitContainerObserver } from '../lib/dom'

describe('DOM utilities', () => {
	beforeEach(() => {
		document.body.innerHTML = ''
	})

	afterEach(() => {
		// Clean up any remaining observers
		document.body.innerHTML = ''
	})

	describe('waitContainerObserver', () => {
		it('resolves immediately if element already exists', async () => {
			// Create test element
			const testElement = document.createElement('div')
			testElement.id = 'test-element'
			document.body.appendChild(testElement)

			const result = await waitContainerObserver('#test-element')

			expect(result).toBe(testElement)
		})

		it('waits for element to be added to DOM', async () => {
			const promise = waitContainerObserver('#dynamic-element')

			// Add element after a short delay
			setTimeout(() => {
				const testElement = document.createElement('div')
				testElement.id = 'dynamic-element'
				document.body.appendChild(testElement)
			}, 10)

			const result = await promise

			expect(result).toBeTruthy()
			expect(result.id).toBe('dynamic-element')
		})

		it('works with complex selectors', async () => {
			const promise = waitContainerObserver('.container .nested-element')

			setTimeout(() => {
				const container = document.createElement('div')
				container.className = 'container'

				const nestedElement = document.createElement('div')
				nestedElement.className = 'nested-element'

				container.appendChild(nestedElement)
				document.body.appendChild(container)
			}, 10)

			const result = await promise

			expect(result).toBeTruthy()
			expect(result.className).toBe('nested-element')
		})

		it('detects elements added deep in the DOM tree', async () => {
			const promise = waitContainerObserver('#deep-element')

			setTimeout(() => {
				const level1 = document.createElement('div')
				const level2 = document.createElement('div')
				const level3 = document.createElement('div')
				const targetElement = document.createElement('div')
				targetElement.id = 'deep-element'

				level3.appendChild(targetElement)
				level2.appendChild(level3)
				level1.appendChild(level2)
				document.body.appendChild(level1)
			}, 10)

			const result = await promise

			expect(result).toBeTruthy()
			expect(result.id).toBe('deep-element')
		})

		it('handles multiple mutations correctly', async () => {
			const promise = waitContainerObserver('#target-element')

			setTimeout(() => {
				// Add some unrelated elements first
				const unrelated1 = document.createElement('div')
				unrelated1.id = 'unrelated-1'
				document.body.appendChild(unrelated1)

				const unrelated2 = document.createElement('div')
				unrelated2.id = 'unrelated-2'
				document.body.appendChild(unrelated2)
			}, 5)

			setTimeout(() => {
				// Add the target element
				const targetElement = document.createElement('div')
				targetElement.id = 'target-element'
				document.body.appendChild(targetElement)
			}, 15)

			const result = await promise

			expect(result).toBeTruthy()
			expect(result.id).toBe('target-element')
		})

		it('works when element is added to a newly created parent', async () => {
			const promise = waitContainerObserver('.parent .child')

			setTimeout(() => {
				const parent = document.createElement('div')
				parent.className = 'parent'
				document.body.appendChild(parent)

				// Add child in next tick to test observation continues
				setTimeout(() => {
					const child = document.createElement('div')
					child.className = 'child'
					parent.appendChild(child)
				}, 5)
			}, 10)

			const result = await promise

			expect(result).toBeTruthy()
			expect(result.className).toBe('child')
		})

		it('stops observing after element is found', async () => {
			// Mock MutationObserver to track disconnect calls
			const originalMutationObserver = window.MutationObserver
			const mockDisconnect = jest.fn()
			const mockObserve = jest.fn()

			window.MutationObserver = jest.fn().mockImplementation((callback) => ({
				observe: mockObserve,
				disconnect: mockDisconnect,
				callback
			}))

			const promise = waitContainerObserver('#test-disconnect')

			setTimeout(() => {
				const testElement = document.createElement('div')
				testElement.id = 'test-disconnect'
				document.body.appendChild(testElement)

				// Trigger the observer callback manually
				const observer = (window.MutationObserver as jest.Mock).mock.results[0].value
				observer.callback()
			}, 10)

			await promise

			expect(mockDisconnect).toHaveBeenCalled()

			// Restore original MutationObserver
			window.MutationObserver = originalMutationObserver
		})
	})
})
