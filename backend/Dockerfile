# Builder runs on host (amd64) only; cross-compiles for arm64 to avoid QEMU
FROM --platform=$BUILDPLATFORM docker.io/paritytech/ci-unified:bullseye-1.88.0-2025-06-27-v202507221446 AS builder

ARG PROFILE=release
ARG TARGETARCH
WORKDIR /app

COPY . .

# Cross-compile for arm64 to avoid QEMU emulation (Invalid ELF); native build for amd64
# ring and other crates with C build scripts need CC/AR for the target
RUN case "${TARGETARCH}" in \
    "arm64") \
      apt-get update -y && apt-get install -y --no-install-recommends gcc-aarch64-linux-gnu && \
      rustup target add aarch64-unknown-linux-gnu && \
      export CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc && \
      export AARCH64_UNKNOWN_LINUX_GNU_CC=aarch64-linux-gnu-gcc && \
      export AARCH64_UNKNOWN_LINUX_GNU_AR=aarch64-linux-gnu-ar && \
      cargo build --${PROFILE} --bins -j 2 --target aarch64-unknown-linux-gnu ;; \
    *) \
      cargo build --${PROFILE} --bins -j 2 ;; \
    esac

# Unify output path for final stage (target/release vs target/aarch64-unknown-linux-gnu/release)
RUN if [ "${TARGETARCH}" = "arm64" ]; then \
      cp target/aarch64-unknown-linux-gnu/${PROFILE}/telemetry_shard target/aarch64-unknown-linux-gnu/${PROFILE}/telemetry_core /app/; \
    else \
      cp target/${PROFILE}/telemetry_shard target/${PROFILE}/telemetry_core /app/; \
    fi

# MAIN IMAGE FOR PEOPLE TO PULL --- small one#
FROM docker.io/debian:bullseye-slim
LABEL maintainer="Parity Technologies"
LABEL description="Substrate Telemetry Backend shard/core binaries, static build"

ARG PROFILE=release
WORKDIR /usr/local/bin

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/telemetry_shard /usr/local/bin
COPY --from=builder /app/telemetry_core /usr/local/bin

RUN useradd -m -u 1000 -U telemetry && \
    apt-get -y update && \
    apt-get -y install openssl && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/

USER telemetry
EXPOSE 8000
