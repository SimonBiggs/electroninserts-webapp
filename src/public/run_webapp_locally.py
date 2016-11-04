import os
from subprocess import call
from multiprocessing import Process
from http.server import HTTPServer, BaseHTTPRequestHandler

def run_api_server():
    call([
        "python", os.path.join(os.getcwd(), 
        'server', 'electronfactor-server', 'main.py')])

def run_http_server(server_class=HTTPServer, handler_class=BaseHTTPRequestHandler):
    server_address = ('', 8000)
    httpd = server_class(server_address, handler_class)
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
