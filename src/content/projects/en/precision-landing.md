---
locale: en
title: 'Vision-Based Precision Landing for Autonomous Drones'
description: 'A real-time computer vision system enabling autonomous drones to detect an IR marker and land on it precisely using a Raspberry Pi and DroneKit.'
pubDate: 2026-06-12
updatedAt: 2026-06-12
technologies: ['Python', 'Raspberry Pi', 'DroneKit', 'MAVLink', 'OpenCV', 'Computer Vision']
status: 'completed'
---

## Purpose

The goal of this project is to let an autonomous drone land precisely on a defined target - far more accurately than GPS alone allows. The drone navigates to a known GPS position, descends to a set altitude, then uses a downward-facing camera to detect a custom infrared marker and close the remaining distance through closed-loop visual control.

Started in 2022, the project was built on top of a master's thesis and reworked its detection and control approach end to end. You can access the thesis via [avesis.marmara.edu.tr](https://avesis.marmara.edu.tr/yonetilen-tez/9449a7a0-ed57-47b5-b5e3-6ee68632d738/doner-kanatli-ihalar-icin-optik-ve-oruntu-tanima-tabanli-otonom-hassas-inis-sistemi-gelistirilmesi) (last accessed: 12 June 2026).

Although the project was started in 2022 and had nearly reached its end by 2024, I only began documenting it in June 2026. Before you make the mistake of asking why it took three years to build and four to document, you can read my [blog post](/en/blog/hardships-being-a-mikkabozu/) - which I'm not proud of.

## Features

- **Real-time marker detection** from a Raspberry Pi camera filtered to 940 nm infrared, isolating the active LED marker from grass, gravel and other natural surfaces.
- **Two-stage detection.** At higher altitudes the system tracks the centroid of all bright points; once low enough for the full T-pattern to resolve, it switches to geometric pattern recognition.
- **Noise-tolerant recognition** based on the geometric ratios of the T-pattern, so stray IR reflections get filtered out instead of causing misidentification.
- **Closed-loop velocity control.** A PID loop closes directly on the marker's pixel offset from frame center - no per-iteration GPS target computation or coordinate conversion chain.
- **Gimbal-mounted camera** that stays pointing straight down regardless of how the drone pitches or rolls, removing attitude compensation from the math.
- **Flight logging.** Every control tick records velocity commands, GPS, altitude and position deltas for post-flight analysis.
- **Live video monitoring** of the Raspberry Pi screen streamed over LAN during flight.

## Usage

The system runs on a Raspberry Pi connected to the flight controller via MAVLink, using DroneKit for vehicle control. Operation proceeds in three stages:

1. **Initialize** - arm the vehicle, verify sensor state, establish MAVLink communication.
2. **Takeoff and search** - climb to search altitude and scan for the marker; the drone holds position and rotates until the pattern is found.
3. **Navigate and land** - compute the marker's offset from frame center, translate it to a velocity correction, and descend while continuously correcting lateral position.

Altitude is read from LIDAR when in range and the barometer otherwise - used only to gate stage transitions and trigger disarm, not to compute position. The landing pad is a custom T-pattern built from 940 nm infrared LEDs, paired with a matching bandpass filter on the camera.

## Limitations

- **IR power vs. altitude.** Making the LED marker bright enough to be seen from high altitude causes heat buildup and drains the marker's dedicated battery quickly, which constrains the practical search altitude.
- **Low-altitude oscillation.** The drone is large relative to the marker, so near the ground the whole vehicle responds to corrections - there's no isolation between camera and airframe, and wind gusts become control inputs. A horizontally stabilized gimbal loop would decouple this.
- **Marker exit at close range.** When the drone is directly above and very close, parts of the pattern leave the frame and full-pattern recognition fails. A size-threshold fallback that tracks partial detections is the intended fix.

## Special Thanks

- [Sateallia](https://sateallia.org/) - for their support throughout the development process.
- The author and supervisors of the [original thesis](https://avesis.marmara.edu.tr/yonetilen-tez/9449a7a0-ed57-47b5-b5e3-6ee68632d738/doner-kanatli-ihalar-icin-optik-ve-oruntu-tanima-tabanli-otonom-hassas-inis-sistemi-gelistirilmesi) - for the foundational work this project was built on top of.

## Access & License

You can access the project's source code via [github.com/caferozpinar/precision-landing-drone](https://github.com/caferozpinar/precision-landing-drone).

Released under the **MIT License**.
