<?php

/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

declare(strict_types=1);

use OCP\Util;

Util::addScript(OCA\NcwAppsMenu\AppInfo\Application::APP_ID, OCA\NcwAppsMenu\AppInfo\Application::APP_ID . '-main');
Util::addStyle(OCA\NcwAppsMenu\AppInfo\Application::APP_ID, OCA\NcwAppsMenu\AppInfo\Application::APP_ID . '-main');

?>

<div id="ncw_apps_menu"></div>
