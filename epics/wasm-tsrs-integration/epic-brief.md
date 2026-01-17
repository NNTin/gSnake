# Epic Brief: Stable Core Interface for wasm-bindgen + ts-rs

## Summary
This epic establishes a stable, well-defined interface between the Rust game engine core and the Svelte client, with future clients in mind. The goal is to reduce frequent interface changes and keep compatibility across minor releases. Today, the Svelte client is the only consumer, but the interface must be durable enough to support additional clients without repeated breaking changes. We will align on shared domain types, versioned payloads if needed, and clear ownership boundaries so the core can evolve without constantly forcing UI changes. This creates a predictable contract that improves iteration speed and lowers integration risk.

## Context & Problem
The current integration between Rust core and the Svelte client changes often, creating friction and rework. As the engine evolves, the UI must keep up with shifting shapes and manual mappings. This slows delivery and will only worsen as more clients are added. We need a stable contract that changes only in minor releases to allow both sides to evolve safely.
