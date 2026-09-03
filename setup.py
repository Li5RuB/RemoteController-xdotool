import os
from setuptools import setup, find_packages

static_files = []
if os.path.exists("static"):
    static_files = [os.path.join("static", f) for f in os.listdir("static") if os.path.isfile(os.path.join("static", f))]

setup(
    name="myrc",
    version="0.1.0",
    py_modules=["main", "server"],
    data_files=[("static", static_files)] if static_files else [],
    entry_points={
        "console_scripts": [
            "myrc=main:run_program",
        ],
    },
)
