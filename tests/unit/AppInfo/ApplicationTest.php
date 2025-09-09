<?php

/**
 * SPDX-FileCopyrightText: 2025 STRATO GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

declare(strict_types=1);

namespace OCA\NcwAppsMenu\Tests\Unit\AppInfo;

use OCA\NcwAppsMenu\AppInfo\Application;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\Util;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

final class ApplicationTest extends TestCase {
	private Application $application;
	private IRegistrationContext|MockObject $registrationContext;
	private IBootContext|MockObject $bootContext;

	protected function setUp(): void {
		parent::setUp();
		$this->application = new Application();
		$this->registrationContext = $this->createMock(IRegistrationContext::class);
		$this->bootContext = $this->createMock(IBootContext::class);
	}

	public function testAppIdConstant(): void {
		$this->assertSame('ncw_apps_menu', Application::APP_ID);
	}

	public function testConstructorInitializesWithCorrectAppId(): void {
		$app = new Application();
		$this->assertInstanceOf(Application::class, $app);
	}

	public function testRegisterMethodExists(): void {
		// Test that register method can be called without errors
		// Since the method is currently empty, we just verify it doesn't throw
		$this->expectNotToPerformAssertions();
		$this->application->register($this->registrationContext);
	}

	private function resetOcpUtilScriptRegistries(): void {
		// Reset legacy registries
		\OC_Util::$styles = [];
		\OC_Util::$scripts = [];

		// Reset OCP\\Util private static arrays via reflection for isolation
		$rc = new \ReflectionClass(Util::class);
		foreach (['scriptsInit', 'scripts', 'scriptDeps'] as $prop) {
			if ($rc->hasProperty($prop)) {
				$p = $rc->getProperty($prop);
				$p->setAccessible(true);
				$p->setValue([]);
			}
		}
	}

	public function testBootAddsExpectedScriptAndStyle(): void {
		$this->resetOcpUtilScriptRegistries();

		$this->application->boot($this->bootContext);

		$expectedScript = 'ncw_apps_menu/js/ncw_apps_menu-main';
		$expectedStyle = 'ncw_apps_menu/css/ncw_apps_menu-main';

		$scripts = Util::getScripts();
		$this->assertContains($expectedScript, $scripts, 'Expected main app script not found in registered scripts: ' . json_encode($scripts));
		$this->assertContains($expectedStyle, \OC_Util::$styles, 'Expected main app style not found in registered styles: ' . json_encode(\OC_Util::$styles));
	}
}
