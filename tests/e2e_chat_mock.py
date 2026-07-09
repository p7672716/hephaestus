from __future__ import annotations

import os

from playwright.sync_api import expect, sync_playwright


BASE_URL = os.environ.get("HEPHAESTUS_E2E_URL", "http://127.0.0.1:8787")


def assert_no_horizontal_overflow(page) -> None:
    overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
    assert not overflow, "page has horizontal overflow"


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        context = browser.new_context(viewport={"width": 1280, "height": 900}, color_scheme="light")
        page = context.new_page()
        page.goto(f"{BASE_URL}/#chat")
        page.wait_for_load_state("networkidle")
        expect(page.locator("#runtimeStatus")).to_contain_text("mock", timeout=10_000)

        composer = page.locator(".conversation-panel form.composer")
        textarea = composer.locator("textarea")
        textarea.fill("alpha omega")
        textarea.evaluate("node => node.setSelectionRange(6, 6)")
        composer.locator(".composer-tool-toggle").click()
        expect(composer.locator(".composer-tool-toggle")).to_have_attribute("aria-expanded", "true")
        composer.locator(".composer-skill-input").fill("ponytail")
        composer.locator(".composer-skill-input").press("Enter")
        expect(textarea).to_have_value("alpha [$ponytail] omega")
        expect(composer.locator(".composer-tool-toggle")).to_have_attribute("aria-expanded", "false")

        textarea.fill("方針を整理して")
        page.locator(".conversation-panel .composer-send").click()
        expect(page.locator(".conversation-panel article").last).to_contain_text("Agents-A1 mock response", timeout=10_000)
        assert_no_horizontal_overflow(page)

        page.locator("#modelRouteSelector button[data-model='ornith']").click()
        page.locator(".conversation-panel form.composer textarea").fill("token " * 80)
        page.locator(".conversation-panel .composer-send").click()
        page.locator("#runtimeStop").click()
        expect(page.locator("#runtimeStop")).to_be_disabled(timeout=10_000)

        page.reload()
        page.wait_for_load_state("networkidle")
        expect(page.locator(".conversation-panel article").filter(has_text="Agents-A1 mock response")).to_be_visible(timeout=10_000)
        assert_no_horizontal_overflow(page)
        context.close()

        mobile = browser.new_context(viewport={"width": 390, "height": 844}, color_scheme="dark")
        mobile_page = mobile.new_page()
        mobile_page.goto(f"{BASE_URL}/#chat")
        mobile_page.wait_for_load_state("networkidle")
        expect(mobile_page.locator("#modelRouteSelector")).to_be_visible(timeout=10_000)
        assert_no_horizontal_overflow(mobile_page)
        mobile.close()

        browser.close()


if __name__ == "__main__":
    main()
