<script lang="ts">
  import { page } from '$app/state';
</script>

<nav class="bg-gray-800 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <div class="shrink-0">
          <a href="/" class="text-xl font-bold">ThrustLab</a>
        </div>
        <div class="md:hidden ml-4">
          <!-- mobile toggle (checkbox hack - no extra script needed) -->
          <input id="mobile-menu-toggle" type="checkbox" class="hidden peer" aria-hidden="true" />
          <label
            for="mobile-menu-toggle"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            aria-label="Toggle navigation"
          >
            <!-- hamburger icon -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>

          <!-- mobile menu (shows when checkbox is checked) -->
          <div class="peer-checked:block hidden mt-2 w-full bg-gray-800 rounded-md">
            <a href="/hangar-zone" class="block px-4 py-2 text-sm font-medium hover:bg-gray-700 {page.url.pathname === '/hangar-zone' ? 'bg-gray-900' : ''}">Hangar Zone</a>
            <a href="/turbofan-zone" class="block px-4 py-2 text-sm font-medium hover:bg-gray-700 {page.url.pathname === '/turbofan-zone' ? 'bg-gray-900' : ''}">Turbofan Zone</a>
            <a href="/overhaul-station" class="block px-4 py-2 text-sm font-medium hover:bg-gray-700 {page.url.pathname === '/overhaul-station' ? 'bg-gray-900' : ''}">Overhaul Station</a>
            <a href="/test-bay" class="block px-4 py-2 text-sm font-medium hover:bg-gray-700 {page.url.pathname === '/test-bay' ? 'bg-gray-900' : ''}">Test Bay</a>
            <a href="/jaja" class="block px-4 py-2 text-sm font-medium hover:bg-gray-700 {page.url.pathname === '/jaja' ? 'bg-gray-900' : ''}">JAJA</a>
          </div>
        </div>

        <div class="hidden md:block">
            <div class="ml-64 flex items-baseline space-x-4">
                <a href="/hangar-zone" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 {page.url.pathname === '/hangar-zone' ? 'bg-gray-900' : ''}">Hangar Zone</a>
                <a href="/turbofan-zone" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 {page.url.pathname === '/turbofan-zone' ? 'bg-gray-900' : ''}">Turbofan Zone</a>
                <a href="/overhaul-station" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 {page.url.pathname === '/overhaul-station' ? 'bg-gray-900' : ''}">Overhaul Station</a>
                <a href="/test-bay" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 {page.url.pathname === '/test-bay' ? 'bg-gray-900' : ''}">Test Bay</a>
                <a href="/jaja" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 {page.url.pathname === '/jaja' ? 'bg-gray-900' : ''}">JAJA</a>
            </div>
        </div>
      </div>
    </div>
  </div>
</nav>