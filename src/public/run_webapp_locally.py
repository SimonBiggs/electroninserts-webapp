import os
from multiprocessing import Process

import http.server
import socketserver


def run_api_server():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    call([
        "python", os.path.join(dir_path, 
        'server', 'electronfactor-server', 'main.py')])


def run_http_server():
    PORT = 8000
    Handler = http.server.SimpleHTTPRequestHandler
    httpd = socketserver.TCPServer(("", PORT), Handler)
    httpd.serve_forever()


print("==============================================")
print("Make sure your use the following addresses for your parameterisation and model server:")
print("    http://localhost:5000/parameterise")
print("    http://localhost:5000/model")
print("==============================================")
print("")
print("==============================================")
print("Starting parameterisation and modelling server")
Process(target=run_api_server).start()
print("Parameterisation and modelling server is now running at http://localhost:5000")
print("==============================================")
print("")
print("==============================================")
print("Starting http server")
Process(target=run_http_server).start()
print("Http server started. Type http://localhost:8000 within a browser to access the webapp.")
print("==============================================")
