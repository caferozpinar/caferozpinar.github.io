---
locale: en
title: 'Vision-Based Precision Landing for Autonomous Drones'
description: 'A real-time computer vision system enabling autonomous drones to detect an IR marker and land on it precisely using a Raspberry Pi and DroneKit.'
pubDate: 2026-06-12
updatedAt: 2026-06-12
technologies: ['Python', 'Raspberry Pi', 'DroneKit', 'MAVLink', 'OpenCV', 'Computer Vision']
status: 'completed'
---

This is a vision-based precision landing system for autonomous drones, developed in 2023. The project was built on top of a master's thesis — the original documentation covers the requirements, technical background, and core approach in depth.

---

## What I Did Differently

**Camera and processing hardware.** The thesis uses an OpenMV camera for image processing, sending results to the Raspberry Pi over UART. I moved everything onto the Raspberry Pi — a Pi camera handles capture, and all processing runs on the Pi itself. One less device in the pipeline, no serial communication overhead, easier debugging.

**Gimbal-mounted camera.** The thesis mounts the camera directly to the drone body. A drone tilts to move — and when it tilts, a fixed camera tilts with it. The marker can drift out of frame during lateral corrections, and any pixel-to-position calculation has to account for the drone's current attitude angle. I mounted the camera on a gimbal instead, keeping it pointing straight down regardless of pitch and roll. The marker stays centered during movement, and the attitude compensation step drops out of the math entirely.

**Two-stage detection.** At higher altitudes, the algorithm averages all bright points it finds in frame and descends toward that centroid. Once the altitude drops to the range where the full T-pattern becomes reliably resolvable, it switches to pattern recognition mode. The transition is altitude-gated.

**Noise-tolerant detection.** The thesis PATTERN mode assumes exactly four points and labels them using a distance-sum matrix. This fails if anything else in the scene reflects at 940nm. I switched to a ratio-based approach: the algorithm checks geometric ratios between candidate points against known T-pattern proportions. Stray reflections get filtered rather than causing misidentification.

**Closed-loop velocity control.** The thesis navigates by computing a target GPS coordinate each iteration and calling `simple_goto`. This requires a full pipeline: pixel offset → altitude-scaled mm → UAV body frame → North/East → lat/lon. I replaced this with direct axis velocity commands. The PID loop closes on the pixel offset itself — where the marker is in the frame right now, translated to a velocity command. The entire coordinate conversion chain drops out.

**Flight logging system.** Every control tick is recorded: velocity commands, GPS coordinates, altitude, position deltas. Twenty-seven flight logs were collected this way, making it possible to diagnose issues after landing rather than guessing in the field.

**Live video monitoring over LAN.** During flights, the Raspberry Pi screen was captured and streamed over the local network in real time.

---

## The Marker

The landing pad uses a custom T-pattern built from 940 nm infrared LEDs. The camera has a matching 940 nm bandpass filter in front of the sensor, making the target distinguishable from the environment — grass, gravel, and most natural surfaces don't emit or reflect 940 nm IR the way the active LEDs do.

This worked well at low altitude. The real constraint was power: running the LEDs bright enough to be visible from high altitude causes heat buildup and drains the battery faster than is practical for a real mission.

The most practical long-term solution: an idle mode architecture. A GPS module and microcontroller sit on the marker platform in listen mode. When the drone is inbound, it broadcasts a landing intent signal over encrypted radio. The marker sends back its GPS coordinates, receives an ETA, and activates the LEDs only for the duration of the approach. No continuous illumination, no thermal runaway.

---

## System Architecture

The stack ran on a Raspberry Pi connected to the flight controller via MAVLink, using DroneKit for vehicle control.

**Stage 1 — Initialize:** Arm the vehicle, verify sensor state, establish MAVLink communication.

**Stage 2 — Takeoff and Search:** Climb to search altitude, scan for the marker. The drone holds position and rotates until the pattern is detected in frame.

**Stage 3 — Navigate and Land:** Compute marker offset from frame center, translate to a velocity correction, close the distance. The control loop continuously corrects lateral position as the drone descends.

The feedback loop: marker offset in pixels → scaled velocity command → sent to the flight controller. Altitude is measured via LIDAR when in range, barometer before that — used to gate stage transitions and trigger disarm, not to feed a position calculation.

---

## What the Logs Show

Twenty-seven flight logs were collected. Each row records the control state at that tick: velocity commands, GPS coordinates, altitude, and derived position deltas. The approach phase is visible as lateral corrections get smaller, and the descent phase as altitude decreases.

One thing that stands out is the oscillation visible during the low-altitude approach. The drone is physically large relative to the marker, and at that altitude the entire vehicle responds to corrections — there is no isolation between "camera moves" and "drone moves."

---

## Edge Cases

**Marker exit at close range.** When the drone is directly above and very close to the marker, parts of the pattern go out of frame. A better approach: once the marker exceeds a size threshold in frame, stop requiring full pattern recognition and just track the center of whatever parts remain visible.

**Low-altitude tracking on a wind-affected platform.** Forcing the drone to serve as the stabilization platform at two meters altitude means every wind gust becomes a control input. A secondary control loop driving the gimbal horizontally would have kept the marker in frame through disturbances that currently cause overshoot.

---

## Takeaways

Precision landing with computer vision is a solvable problem with modest hardware. The Raspberry Pi is genuinely capable of running a real-time detection and control loop fast enough for this application. The harder problems are mechanical and optical: isolating the camera from the vehicle, and designing a marker detectable across the full altitude range.

The next version would use a two-axis stabilized gimbal with an independent control loop, a two-stage marker system (large passive marker for search, IR active marker for landing), and a detection fallback that degrades gracefully — tracking the centroid of partial detections rather than failing outright.
