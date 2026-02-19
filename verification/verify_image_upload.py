from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Login
        print("Navigating to login...")
        page.goto("http://localhost:8000/login")

        print("Logging in...")
        # Use IDs as labels are styled/uppercase
        page.locator("#email").fill("admin@taponazo.es")
        page.locator("#password").fill("Taponazo2026")
        page.get_by_role("button", name="ENTRAR AL REINO").click()

        # Wait for dashboard
        try:
            expect(page).to_have_url("http://localhost:8000/dashboard", timeout=20000)
            print("Login successful")
        except:
            print(f"Login failed or redirected to {page.url}")
            page.screenshot(path="verification/login_fail.png")
            browser.close()
            return

        # Navigate to Create Location page
        print("Navigating to Create Location...")
        page.goto("http://localhost:8000/admin/locations/create")

        # Check if page loaded
        try:
            # Look for heading or part of it
            expect(page.get_by_role("heading").first).to_be_visible()
            print("Create Location page loaded")
        except:
            print("Failed to load Create Location page")
            page.screenshot(path="verification/page_fail.png")
            browser.close()
            return

        # Test large file upload (toast error)
        print("Uploading large file...")
        file_input = page.locator("input[type='file']").first
        file_input.set_input_files("large_image.jpg")

        # Check for toast
        print("Checking for toast...")
        toast = page.get_by_text("El archivo debe ser menor a 2MB")
        try:
            expect(toast).to_be_visible(timeout=5000)
            print("Toast visible!")
            page.screenshot(path="verification/toast_error.png")
        except:
            print("Toast not found")
            page.screenshot(path="verification/toast_fail.png")

        # Test valid file upload and focus state
        print("Uploading valid file...")
        file_input.set_input_files("small_image.png")

        # Wait for image preview
        print("Waiting for preview...")
        # The delete button appears when preview exists
        delete_btn = page.get_by_label("Eliminar imagen")
        try:
            # It might be technically 'visible' in DOM but opacity 0
            # Wait for it to exist in DOM first
            delete_btn.wait_for(state="attached")
            print("Delete button attached")
        except:
             print("Delete button not found")
             page.screenshot(path="verification/preview_fail.png")

        # Now tab to the delete button to trigger focus-within
        print("Focusing delete button...")
        delete_btn.focus()

        # Verify visibility (it should have opacity 1 via focus-within on parent)
        # Note: Playwright's check for visibility might respect opacity.
        # But we added focus-within:opacity-100 to parent.

        # Take screenshot of focused state
        page.screenshot(path="verification/focus_state.png")
        print("Focus state captured")

        browser.close()

if __name__ == "__main__":
    run()
