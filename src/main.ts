/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
import AppsMenu from './lib/view/AppsMenu.vue'
Vue.mixin({ methods: { t, n } })

const View = Vue.extend(AppsMenu)
new View().$mount('#ncw_apps_menu')
