---
locale: en
title: 'Vision-Based Precision Landing for Autonomous Drones'
description: 'A real-time computer vision system enabling autonomous drones to detect an IR marker and land on it precisely using a Raspberry Pi and DroneKit.'
pubDate: 2026-06-12
updatedAt: 2026-06-12
technologies: ['Python', 'Raspberry Pi', 'DroneKit', 'MAVLink', 'OpenCV', 'Computer Vision']
status: 'completed'
githubUrl: 'https://github.com/caferozpinar/precision-landing-drone'
---

## Purpose

The goal of this project is to let an autonomous drone land precisely on a defined target — far more accurately than GPS alone allows. The drone navigates to a known GPS position, descends to a set altitude, then uses a downward-facing camera to detect a custom infrared marker and close the remaining distance through closed-loop visual control.

Started in 2023, the project was built on top of a master's thesis and reworked its detection and control approach end to end.

## Features

- **Real-time marker detection** from a Raspberry Pi camera filtered to 940 nm infrared, isolating the active LED marker from grass, gravel and other natural surfaces.
- **Two-stage detection.** At higher altitudes the system tracks the centroid of all bright points; once low enough for the full T-pattern to resolve, it switches to geometric pattern recognition.
- **Noise-tolerant recognition** based on the geometric ratios of the T-pattern, so stray IR reflections get filtered out instead of causing misidentification.
- **Closed-loop velocity control.** A PID loop closes directly on the marker's pixel offset from frame center — no per-iteration GPS target computation or coordinate conversion chain.
- **Gimbal-mounted camera** that stays pointing straight down regardless of how the drone pitches or rolls, removing attitude compensation from the math.
- **Flight logging.** Every control tick records velocity commands, GPS, altitude and position deltas — 27 flight logs were collected for post-flight analysis.
- **Live video monitoring** of the Raspberry Pi screen streamed over LAN during flight.

## Usage

The system runs on a Raspberry Pi connected to the flight controller via MAVLink, using DroneKit for vehicle control. Operation proceeds in three stages:

1. **Initialize** — arm the vehicle, verify sensor state, establish MAVLink communication.
2. **Takeoff and search** — climb to search altitude and scan for the marker; the drone holds position and rotates until the pattern is found.
3. **Navigate and land** — compute the marker's offset from frame center, translate it to a velocity correction, and descend while continuously correcting lateral position.

Altitude is read from LIDAR when in range and the barometer otherwise — used only to gate stage transitions and trigger disarm, not to compute position. The landing pad is a custom T-pattern built from 940 nm infrared LEDs, paired with a matching bandpass filter on the camera.

## Limitations

- **IR power vs. altitude.** Making the LED marker bright enough to be seen from high altitude causes heat buildup and drains the marker's dedicated battery quickly, which constrains the practical search altitude. A planned idle-mode design (the marker activates its LEDs over an encrypted radio link only during the approach) addresses this but isn't part of the current build.
- **Low-altitude oscillation.** The drone is large relative to the marker, so near the ground the whole vehicle responds to corrections — there's no isolation between camera and airframe, and wind gusts become control inputs. A horizontally stabilized gimbal loop would decouple this.
- **Marker exit at close range.** When the drone is directly above and very close, parts of the pattern leave the frame and full-pattern recognition fails. A size-threshold fallback that tracks partial detections is the intended fix.

## Access & License

Source code: [github.com/caferozpinar/precision-landing-drone](https://github.com/caferozpinar/precision-landing-drone)

Released under the **MIT License**.
