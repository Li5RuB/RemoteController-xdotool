# i3RemoteControl (myrc)

A console utility for remote control and automation in the **i3wm** window manager, featuring a web-based interface built with FastAPI/Starlette.

---

## Prerequisites

To correctly emulate keypresses, shortcuts, and window actions, your system must have the `xdotool` utility installed.

### Installing xdotool:

* **Ubuntu / Debian / Linux Mint:**
  ```bash
  sudo apt update && sudo apt install xdotool -y
  ```
* **Arch Linux / Manjaro:**
  ```bash
  sudo pacman -S xdotool
  ```
* **Fedora / RHEL:**
  ```bash
  sudo dnf install xdotool
  ```

---

## Installation

You can install the utility in two ways. Before starting, clone the repository and navigate into the project directory:

```bash
git clone https://github.com
cd i3RemoteControl
```

### Option 1. Isolated Installation via pipx (Recommended)
This method installs the utility in an isolated environment and makes the `myrc` command available globally across your terminal.

```bash
# Install the package in editable development mode
pipx install --editable . --force
```

### Option 2. Standard Installation via pip
If you prefer using a standard virtual environment (`venv`):

1. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. **Install the required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Install the package itself:**
   ```bash
   pip install -e .
   ```

---

## Running the Application

Once installed successfully, you can launch the control server from any directory using a single command:

```bash
myrc
```

After the server starts, the web interface will be accessible via your mobile or desktop browser at the address displayed in the console (typically `http://localhost:8000` or your local network IP).

---

## Features

- **Virtual Touchpad & Scroll Zone:** Fluid mouse navigation optimized specifically for mobile screens.
- **iOS Safari Optimization:** Built-in safeguards against native iOS zoom, touch-delays, and text-selection magnifying loupes.
- **Dual Keyboard Layouts:** Toggle between an on-screen layout viewer (`simple-keyboard`) and a native mobile input modal with an anti-loss character buffer for long texts.
- **Modifier Keys Toggle:** Fully operational `Mod`, `Shift`, `Alt`, and `Ctrl` button combinations for triggering complex window-manager shortcuts.

---

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
