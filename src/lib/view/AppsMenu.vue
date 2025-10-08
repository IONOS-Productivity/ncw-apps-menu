<!--
  - SPDX-FileCopyrightText: 2025 STRATO GmbH
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcHeaderMenu id="ncw_apps_menu"
		class="ncwappsmenu"
		is-nav
		:aria-label="t('core', 'Applications menu')"
		@open="handleOpen">
		<template #trigger>
			<Apps class="ncwappsmenu__trigger-icon" :size="32" />
		</template>
		<div class="ncwappsmenu__menu">
			<div class="ncwappsmenu__grid">
				<div v-for="app in appsList"
					:key="app.id"
					class="ncwappsmenu__app-item">
					<a class="ncwappsmenu__app-icon"
						:href="app.href"
						:title="app.name"
						:aria-current="app.active ? 'page' : false"
						:target="app.target ? '_blank' : undefined"
						:rel="app.target ? 'noopener noreferrer' : undefined">
						<img :src="app.icon"
							:alt="app.name"
							:title="app.name"
							class="ncwappsmenu__app-image">
					</a>
					<span class="ncwappsmenu__app-name">{{ app.name }}</span>
				</div>
			</div>
		</div>
	</NcHeaderMenu>
</template>

<script lang="ts">
import type { INavigationEntry } from '../../types/navigation'
import Vue from 'vue'
import NcHeaderMenu from '@nextcloud/vue/dist/Components/NcHeaderMenu.js'
import Apps from 'vue-material-design-icons/Apps.vue'
import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'

export default Vue.extend({
	name: 'NcwAppsMenu',
	components: {
		NcHeaderMenu,
		Apps,
	},
	data() {
		const appsList = loadState<INavigationEntry[]>('core', 'apps', [])
		return {
			appsList,
		}
	},

	mounted() {
		subscribe('nextcloud:app-menu.refresh', this.setApps)
	},

	beforeDestroy() {
		unsubscribe('nextcloud:app-menu.refresh', this.setApps)
	},

	methods: {
		async handleOpen(): Promise<void> {
		},
		setApps({ apps }: { apps: INavigationEntry[]}) {
			this.appsList = apps
		},
		t,
	},
})
</script>

<style scoped lang="scss">
$app-icon-size: 96px;
$grid-gap: 0px;
$grid-padding: 0px;
$rows-visible: 3;
$app-name-line-height: 18px;
$grid-image-size: 53px;

.ncwappsmenu {
	&__trigger-icon {
		color: var(--color-background-plain-text) !important;
	}

	// Ensure proper sizing for the menu content
	:deep(.header-menu__content) {
		width: 320px !important;
		max-height: 400px;
		padding: 0 !important;
	}

	&__menu {
		padding: var(--default-grid-baseline);
		overflow: hidden;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat($rows-visible, 1fr);
		gap: $grid-gap;
		max-height: calc(($app-icon-size + $grid-gap) * $rows-visible - $grid-gap + ($grid-padding * 2));
		overflow-y: auto;
		padding: $grid-padding;

		// Custom scrollbar styling
		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-track {
			background: var(--color-background-hover);
			border-radius: 3px;
		}

		&::-webkit-scrollbar-thumb {
			background: var(--color-text-maxcontrast);
			border-radius: 3px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: var(--color-text-light);
		}
	}

	&__app-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: var(--border-radius-large);
		cursor: pointer;
		transition: background-color 0.2s ease;
		text-decoration: none;
		height: $app-icon-size;
		width: $app-icon-size;

		&:hover {
			background-color: var(--ion-context-menu-item-background-hover);
		}

		&:focus {
			outline: 2px solid var(--color-primary-element);
			outline-offset: 2px;
		}
	}

	&__app-icon {
		width: $grid-image-size;
		height: $grid-image-size;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 6px;
	}

	&__app-image {
		width: $grid-image-size;
		height: $grid-image-size;
		object-fit: contain;
		border-radius: var(--border-radius);
		color: var(--color-text-light);
		fill: var(--color-text-light);
		filter: var(--background-invert-if-bright);

		@media (prefers-color-scheme: dark) {
			filter: none;
		}
	}

	&__app-name {
		font-size: 12px;
		font-weight: 500;
		color: var(--color-text-light);
		text-align: center;
		line-height: $app-name-line-height;
		max-width: 80px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
