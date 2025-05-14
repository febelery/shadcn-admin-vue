<template>
  <div
    class="relative h-svh w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-gray-900"
  >
    <!-- 背景装饰 - 更高级的服务器电路/芯片图案和视觉效果 -->
    <div class="absolute inset-0 z-0">
      <!-- 背景底色渐变 -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/70 via-white/90 to-blue-50/80"></div>

      <!-- 电路板层次纹理 -->
      <div
        class="absolute inset-0 opacity-5"
        style="
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM0MzM4REQiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTIwLDEgTDEsMjAgTDIwLDM5IEwzOSwyMCBMMjAsMSIgLz48cGF0aCBkPSJNMCwyMCBMMjAsMCBMNDAsMjAgTDIwLDQwIEwwLDIwIiAvPjwvZz48L3N2Zz4=');
          background-size: 40px 40px;
        "
      ></div>

      <!-- 优化的电路图案 SVG 背景 - 多层次 -->
      <div class="absolute inset-0">
        <!-- 大型电路背景 - 底层 -->
        <svg class="absolute h-full w-full opacity-10" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern-large" width="200" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M0 100 H60 M140 100 H200 M100 0 V60 M100 140 V200"
                stroke="#4338CA"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M40 40 H80 M120 40 H160 M40 160 H80 M120 160 H160"
                stroke="#4F46E5"
                stroke-width="1.5"
                fill="none"
              />
              <path
                d="M40 40 V80 M160 40 V80 M40 160 V120 M160 160 V120"
                stroke="#4F46E5"
                stroke-width="1.5"
                fill="none"
              />
              <path d="M100 100 m-20 0 h40 m-20 -20 v40" stroke="#3730A3" stroke-width="2" fill="none" />
              <circle cx="100" cy="100" r="6" fill="#4F46E5" />
              <circle cx="60" cy="100" r="4" fill="#4F46E5" />
              <circle cx="140" cy="100" r="4" fill="#4F46E5" />
              <circle cx="100" cy="60" r="4" fill="#4F46E5" />
              <circle cx="100" cy="140" r="4" fill="#4F46E5" />
              <circle cx="40" cy="40" r="3" fill="#4F46E5" />
              <circle cx="160" cy="40" r="3" fill="#4F46E5" />
              <circle cx="40" cy="160" r="3" fill="#4F46E5" />
              <circle cx="160" cy="160" r="3" fill="#4F46E5" />
            </pattern>

            <!-- 中型电路 -->
            <pattern id="circuit-pattern-medium" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 H30 M70 50 H100 M50 0 V30 M50 70 V100" stroke="#6366F1" stroke-width="1.5" fill="none" />
              <path d="M20 20 H40 M60 20 H80 M20 80 H40 M60 80 H80" stroke="#818CF8" stroke-width="1" fill="none" />
              <path d="M20 20 V40 M80 20 V40 M20 80 V60 M80 80 V60" stroke="#818CF8" stroke-width="1" fill="none" />
              <circle cx="50" cy="50" r="3" fill="#6366F1" />
              <circle cx="30" cy="50" r="2" fill="#6366F1" />
              <circle cx="70" cy="50" r="2" fill="#6366F1" />
              <circle cx="50" cy="30" r="2" fill="#6366F1" />
              <circle cx="50" cy="70" r="2" fill="#6366F1" />
              <circle cx="20" cy="20" r="1.5" fill="#818CF8" />
              <circle cx="80" cy="20" r="1.5" fill="#818CF8" />
              <circle cx="20" cy="80" r="1.5" fill="#818CF8" />
              <circle cx="80" cy="80" r="1.5" fill="#818CF8" />
            </pattern>

            <!-- 小型精细电路 -->
            <pattern id="circuit-pattern-small" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M0 25 H15 M35 25 H50 M25 0 V15 M25 35 V50" stroke="#A5B4FC" stroke-width="0.8" fill="none" />
              <path d="M10 10 H20 M30 10 H40 M10 40 H20 M30 40 H40" stroke="#C7D2FE" stroke-width="0.6" fill="none" />
              <path d="M10 10 V20 M40 10 V20 M10 40 V30 M40 40 V30" stroke="#C7D2FE" stroke-width="0.6" fill="none" />
              <circle cx="25" cy="25" r="1.5" fill="#A5B4FC" />
              <circle cx="15" cy="25" r="1" fill="#A5B4FC" />
              <circle cx="35" cy="25" r="1" fill="#A5B4FC" />
              <circle cx="25" cy="15" r="1" fill="#A5B4FC" />
              <circle cx="25" cy="35" r="1" fill="#A5B4FC" />
              <circle cx="10" cy="10" r="0.8" fill="#C7D2FE" />
              <circle cx="40" cy="10" r="0.8" fill="#C7D2FE" />
              <circle cx="10" cy="40" r="0.8" fill="#C7D2FE" />
              <circle cx="40" cy="40" r="0.8" fill="#C7D2FE" />
            </pattern>

            <!-- 定义发光效果的滤镜 -->
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <!-- 定义脉冲效果 -->
            <filter id="pulse" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="glow"
              />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          <!-- 三层电路叠加 -->
          <rect width="100%" height="100%" fill="url(#circuit-pattern-large)" />
          <rect width="100%" height="100%" fill="url(#circuit-pattern-medium)" opacity="0.7" />
          <rect width="100%" height="100%" fill="url(#circuit-pattern-small)" opacity="0.5" />
        </svg>

        <!-- 发光节点效果 - 随机位置的重点突出 -->
        <div v-for="i in 5" :key="`node-${i}`" class="absolute">
          <Motion
            :initial="{
              x: 15 + Math.random() * 70 + '%',
              y: 15 + Math.random() * 70 + '%',
              scale: 1,
            }"
            :animate="{
              scale: [1, 1.2, 1],
            }"
            :transition="{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: 'loop',
            }"
          >
            <div
              class="rounded-full bg-indigo-500/20"
              :style="{
                width: 15 + Math.random() * 25 + 'px',
                height: 15 + Math.random() * 25 + 'px',
                filter: 'blur(8px)',
              }"
            ></div>
          </Motion>
        </div>
      </div>

      <!-- 增强的渐变发光区域 - 更微妙的多层次 -->
      <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/40 to-transparent opacity-40"></div>
      <div class="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-50/30 to-transparent opacity-30"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-violet-50/20 to-transparent opacity-20"></div>

      <!-- 光晕效果区域 -->
      <div class="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2">
        <Motion
          :initial="{ opacity: 0.3, scale: 1 }"
          :animate="{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }"
          :transition="{ duration: 4, repeat: Infinity, repeatType: 'loop' }"
        >
          <div class="h-64 w-64 rounded-full bg-blue-400/10" style="filter: blur(40px)"></div>
        </Motion>
      </div>

      <div class="absolute right-1/4 bottom-1/3 -translate-x-1/2 -translate-y-1/2">
        <Motion
          :initial="{ opacity: 0.2, scale: 1 }"
          :animate="{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }"
          :transition="{ duration: 5, repeat: Infinity, repeatType: 'loop', delay: 1 }"
        >
          <div class="h-48 w-48 rounded-full bg-indigo-500/10" style="filter: blur(30px)"></div>
        </Motion>
      </div>

      <!-- 多层次电流脉冲动画 - 优化的路径和效果 -->
      <Motion
        :initial="{ pathLength: 0, opacity: 0.3 }"
        :animate="{ pathLength: 1, opacity: 0.7 }"
        :transition="{ duration: 2.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }"
        class="absolute h-full w-full opacity-30"
      >
        <svg viewBox="0 0 800 800" class="absolute h-full w-full">
          <path
            d="M200,200 C300,100 500,300 600,200 S700,400 800,300"
            stroke="#3B82F6"
            stroke-width="6"
            fill="none"
            stroke-linecap="round"
            filter="url(#glow)"
          ></path>
          <!-- 沿线运动的亮点 -->
          <circle r="3" fill="#60A5FA">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path="M200,200 C300,100 500,300 600,200 S700,400 800,300"
            />
          </circle>
        </svg>
      </Motion>

      <Motion
        :initial="{ pathLength: 0, opacity: 0.3 }"
        :animate="{ pathLength: 1, opacity: 0.7 }"
        :transition="{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 0.5 }"
        class="absolute h-full w-full opacity-30"
      >
        <svg viewBox="0 0 800 800" class="absolute h-full w-full">
          <path
            d="M100,400 C200,300 300,500 400,400 S500,300 600,500"
            stroke="#6366F1"
            stroke-width="6"
            fill="none"
            stroke-linecap="round"
            filter="url(#glow)"
          ></path>
          <!-- 沿线运动的亮点 -->
          <circle r="3" fill="#818CF8">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M100,400 C200,300 300,500 400,400 S500,300 600,500"
            />
          </circle>
        </svg>
      </Motion>

      <!-- 新增脉冲电流 - 优化效果 -->
      <Motion
        :initial="{ pathLength: 0, opacity: 0.3 }"
        :animate="{ pathLength: 1, opacity: 0.7 }"
        :transition="{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 1 }"
        class="absolute h-full w-full opacity-20"
      >
        <svg viewBox="0 0 800 800" class="absolute h-full w-full">
          <path
            d="M50,150 C150,50 250,250 350,150 S450,50 550,250 S650,350 750,250"
            stroke="#818CF8"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
            filter="url(#glow)"
          ></path>
          <!-- 沿线运动的亮点 -->
          <circle r="2" fill="#A5B4FC">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M50,150 C150,50 250,250 350,150 S450,50 550,250 S650,350 750,250"
            />
          </circle>
        </svg>
      </Motion>

      <!-- 数据流动效果 - 代表数据包传输 -->
      <div class="absolute inset-0 overflow-hidden">
        <div v-for="i in 20" :key="`flow-${i}`" class="absolute">
          <Motion
            :initial="{
              x: -20,
              y: 20 + Math.random() * 80 + '%',
              opacity: 0.4 + Math.random() * 0.3,
            }"
            :animate="{
              x: '120%',
            }"
            :transition="{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: 'loop',
              delay: Math.random() * 10,
              ease: 'linear',
            }"
          >
            <div
              class="flex space-x-1"
              :style="{
                opacity: 0.3 + Math.random() * 0.4,
                filter: 'blur(' + (Math.random() > 0.7 ? 1 : 0) + 'px)',
              }"
            >
              <div
                v-for="j in 1 + Math.floor(Math.random() * 5)"
                :key="`bit-${j}`"
                class="h-1 rounded-full bg-indigo-400"
                :style="{
                  width: 2 + Math.random() * 4 + 'px',
                }"
              ></div>
            </div>
          </Motion>
        </div>
      </div>

      <!-- 浮动粒子效果 - 优化的效果 -->
      <div class="absolute inset-0">
        <div v-for="i in 20" :key="`particle-${i}`" class="absolute">
          <Motion
            :initial="{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0.1 + Math.random() * 0.4,
              scale: 0.8 + Math.random() * 0.4,
            }"
            :animate="{
              x: [null, Math.random() * 100 + '%', Math.random() * 100 + '%', Math.random() * 100 + '%'],
              y: [null, Math.random() * 100 + '%', Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [null, 0.1 + Math.random() * 0.3, 0.3 + Math.random() * 0.4, 0.1 + Math.random() * 0.3],
              scale: [null, 0.7 + Math.random() * 0.6, 1 + Math.random() * 0.5, 0.7 + Math.random() * 0.6],
            }"
            :transition="{
              duration: 15 + Math.random() * 25,
              repeat: Infinity,
              repeatType: 'loop',
            }"
          >
            <div
              class="rounded-full bg-indigo-400/60"
              :style="{
                width: 2 + Math.random() * 3 + 'px',
                height: 2 + Math.random() * 3 + 'px',
                filter: 'blur(' + (Math.random() > 0.5 ? 1 : 0) + 'px)',
              }"
            ></div>
          </Motion>
        </div>
      </div>
    </div>

    <div class="relative z-10 flex h-full w-full items-center justify-center p-6">
      <div class="w-full max-w-2xl">
        <!-- 主卡片容器 - 增强玻璃效果 -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7 }"
          class="overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-md"
        >
          <div class="relative px-8 py-10">
            <!-- 顶部服务器错误图示 - 增强 -->
            <div class="mb-6 flex justify-center">
              <Motion
                :initial="{ opacity: 0, scale: 0.8 }"
                :animate="{ opacity: 1, scale: 1 }"
                :transition="{ duration: 0.5 }"
              >
                <div class="relative">
                  <!-- 服务器图标背景光效 -->
                  <div class="absolute inset-0 -m-6 rounded-full bg-indigo-50"></div>
                  <div
                    class="absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-blue-100/80 to-indigo-100/80 blur-md"
                  ></div>

                  <!-- 服务器图标 -->
                  <div class="relative">
                    <div class="relative flex items-center justify-center">
                      <div
                        class="flex h-24 w-24 items-center justify-center rounded-full border-4 border-dashed border-indigo-200 p-1"
                      >
                        <!-- 服务器灯光动画 -->
                        <Motion
                          :initial="{ opacity: 1 }"
                          :animate="{ opacity: [1, 0.3, 1] }"
                          :transition="{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }"
                          class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"
                        ></Motion>

                        <Motion
                          :initial="{ opacity: 1 }"
                          :animate="{ opacity: [1, 0.3, 1] }"
                          :transition="{ duration: 1.5, repeat: Infinity, repeatType: 'loop', delay: 0.5 }"
                          class="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50"
                        ></Motion>

                        <Motion
                          :initial="{ opacity: 1 }"
                          :animate="{ opacity: [1, 0.3, 1] }"
                          :transition="{ duration: 1.5, repeat: Infinity, repeatType: 'loop', delay: 1 }"
                          class="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-green-400 shadow-lg shadow-green-400/50"
                        ></Motion>

                        <!-- 服务器图标脉冲效果 -->
                        <Motion
                          :initial="{ scale: 1, opacity: 0.7 }"
                          :animate="{ scale: [1, 1.1, 1], opacity: [0.7, 0.9, 0.7] }"
                          :transition="{ duration: 2, repeat: Infinity, repeatType: 'loop' }"
                        >
                          <ServerCrashIcon class="h-12 w-12 text-indigo-500 drop-shadow-md" />
                        </Motion>
                      </div>
                    </div>
                  </div>
                </div>
              </Motion>
            </div>

            <!-- 500 标题 - 增强效果 -->
            <div class="text-center">
              <Motion
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.6, delay: 0.3 }"
              >
                <div class="relative">
                  <!-- 5后面的0 - 增强动画效果 -->
                  <Motion
                    :initial="{ x: 0, rotate: 0 }"
                    :animate="{
                      x: [0, 2, -2, 0],
                      rotate: [0, 1, -1, 0],
                    }"
                    :transition="{ duration: 0.3, repeat: 3, repeatDelay: 3 }"
                    class="relative inline-block"
                  >
                    <span
                      class="relative z-10 text-7xl font-bold text-indigo-600 md:text-8xl"
                      style="
                        text-shadow:
                          3px 3px 0 rgba(99, 102, 241, 0.2),
                          0 0 20px rgba(79, 70, 229, 0.1);
                      "
                      >5</span
                    >
                  </Motion>

                  <Motion
                    :initial="{ x: 0, rotate: 0 }"
                    :animate="{
                      x: [0, -2, 2, 0],
                      rotate: [0, -1, 1, 0],
                    }"
                    :transition="{ duration: 0.5, repeat: 3, repeatDelay: 3 }"
                    class="relative inline-block"
                  >
                    <span
                      class="relative z-10 text-7xl font-bold text-indigo-600 md:text-8xl"
                      style="
                        text-shadow:
                          3px 3px 0 rgba(99, 102, 241, 0.2),
                          0 0 20px rgba(79, 70, 229, 0.1);
                      "
                      >0</span
                    >
                  </Motion>

                  <Motion
                    :initial="{ x: 0, rotate: 0 }"
                    :animate="{
                      x: [0, 2, -2, 0],
                      rotate: [0, 1, -1, 0],
                    }"
                    :transition="{ duration: 0.3, repeat: 3, repeatDelay: 3 }"
                    class="relative inline-block"
                  >
                    <span
                      class="relative z-10 text-7xl font-bold text-indigo-600 md:text-8xl"
                      style="
                        text-shadow:
                          3px 3px 0 rgba(99, 102, 241, 0.2),
                          0 0 20px rgba(79, 70, 229, 0.1);
                      "
                      >0</span
                    >
                  </Motion>

                  <!-- 增加数字荧光效果 -->
                  <div class="absolute top-0 left-0 -z-10 h-full w-full blur-xl">
                    <Motion
                      :initial="{ opacity: 0.3 }"
                      :animate="{ opacity: [0.3, 0.6, 0.3] }"
                      :transition="{ duration: 2, repeat: Infinity }"
                      class="h-full w-full text-7xl font-bold text-indigo-400 md:text-8xl"
                    >
                      500
                    </Motion>
                  </div>
                </div>

                <h3 class="mt-2 text-xl font-semibold tracking-wide text-blue-500">服务器内部错误</h3>
              </Motion>

              <!-- 服务器错误线条 - 增强效果 -->
              <div class="relative mx-auto my-6 h-px overflow-hidden">
                <Motion
                  :initial="{ width: 0 }"
                  :animate="{ width: '100%' }"
                  :transition="{ duration: 1, delay: 0.6 }"
                  class="absolute h-px w-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                ></Motion>

                <!-- 添加脉冲效果 -->
                <Motion
                  :initial="{ opacity: 0.3, scale: 1 }"
                  :animate="{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.02, 1] }"
                  :transition="{ duration: 2, repeat: Infinity }"
                  class="absolute h-px w-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent blur-sm"
                ></Motion>
              </div>

              <!-- 错误代码和说明 - 增强控制台效果 -->
              <Motion
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :transition="{ duration: 0.6, delay: 0.8 }"
                class="space-y-2"
              >
                <!-- 模拟控制台输出 - 增加更真实的终端效果 -->
                <div
                  class="mx-auto max-w-md overflow-hidden rounded-lg border border-gray-700 bg-gray-900 p-4 text-left font-mono text-xs text-gray-300 shadow-lg"
                >
                  <!-- 终端标题栏 -->
                  <div class="mb-2 flex items-center border-b border-gray-700 pb-1">
                    <div class="mr-1 h-2.5 w-2.5 rounded-full bg-red-500"></div>
                    <div class="mr-1 h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                    <div class="mr-3 h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    <div class="text-xs text-gray-400">system_status.log</div>
                  </div>

                  <!-- 终端内容 -->
                  <div class="space-y-1">
                    <div class="flex">
                      <span class="mr-2 text-red-400">ERROR:</span>
                      <span class="text-blue-300">500 Internal Server Error</span>
                    </div>
                    <div class="flex">
                      <span class="mr-2 text-green-400">STATUS:</span>
                      <Motion
                        :initial="{ opacity: 1 }"
                        :animate="{ opacity: [1, 0.5, 1] }"
                        :transition="{ duration: 1, repeat: Infinity }"
                      >
                        <span class="text-red-400">系统运行异常</span>
                      </Motion>
                    </div>
                    <div class="flex">
                      <span class="mr-2 text-yellow-400">INFO:</span>
                      <span>服务器遇到了意外情况，无法完成请求</span>
                    </div>
                    <!-- <div class="flex">
                      <span class="mr-2 text-blue-400">TRACE:</span>
                      <span class="truncate">server/core/handler.js:235 Exception thrown</span>
                    </div> -->

                    <!-- 闪烁的光标 -->
                    <div class="flex items-center pt-1">
                      <span class="mr-1 text-cyan-500">$</span>
                      <Motion
                        :initial="{ opacity: 1 }"
                        :animate="{ opacity: [1, 0, 1] }"
                        :transition="{ duration: 0.8, repeat: Infinity }"
                        class="h-3 w-2 bg-cyan-500"
                      ></Motion>
                    </div>
                  </div>
                </div>

                <p class="mt-4 text-sm text-gray-600">我们的工程师正在努力解决这个问题，请稍后再试</p>
              </Motion>
            </div>

            <!-- 按钮区域 - 增强效果 -->
            <Motion
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 1.2 }"
              class="mt-8 flex flex-wrap justify-center gap-4"
            >
              <Button @click="goBack" variant="outline" class="group relative overflow-hidden">
                <div class="relative z-10 flex items-center">
                  <ArrowLeft class="mr-2 h-4 w-4" />
                  返回
                </div>
                <div
                  class="absolute inset-0 -z-10 bg-gradient-to-r from-gray-100 to-gray-50 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"
                ></div>
                <!-- 悬停时边缘发光效果 -->
                <div
                  class="absolute inset-0 rounded-md opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                ></div>
              </Button>

              <Button @click="goHome" class="group relative overflow-hidden">
                <div class="relative z-10 flex items-center">
                  <HomeIcon class="mr-2 h-4 w-4" />
                  首页
                </div>
                <div
                  class="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"
                ></div>
                <!-- 悬停时发光效果 -->
                <div
                  class="absolute inset-0 rounded-md opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.7)]"
                ></div>
              </Button>
            </Motion>
          </div>
        </Motion>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Home as HomeIcon, ServerCrash as ServerCrashIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}

const refresh = () => {
  window.location.reload()
}
</script>
