import os
import platform
import socket
import subprocess
import time

from .client import Client


class RemoteServer(object):

    def __init__(self, host, port):
        """
        Initialises a RemoteServer object

        :param host: The host of the proxy server.
        :param port: The port of the proxy server.
        """
        self.host = host
        self.port = port

    @property
    def url(self):
        """
        Gets the url that the proxy is running on. This is not the URL clients
        should connect to.
        """
        return "http://%s:%d" % (self.host, self.port)

    def create_proxy(self, params={}):
        """
        Gets a client class that allow to set all the proxy details that you
        may need to.
        :param params: Dictionary where you can specify params \
                    like httpProxy and httpsProxy
        """
        client = Client(self.url[7:], params)
        return client

    def _is_listening(self):
        try:
            socket_ = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            socket_.settimeout(1)
            socket_.connect((self.host, self.port))
            socket_.close()
            return True
        except socket.error:
            return False


class Server(RemoteServer):

    def __init__(self, path='browsermob-proxy', options={}):
        """
        Initialises a Server object

        :param path: Path to the browsermob proxy batch file
        :param options: Dictionary that can hold the port. \
                     More items will be added in the future. \
                     This defaults to an empty dictionary
        """
        path_var_sep = ':'
        if platform.system() == 'Windows':
            path_var_sep = ';'
            if not path.endswith('.bat'):
                path += '.bat'

        exec_not_on_path = True
        for directory in os.environ['PATH'].split(path_var_sep):
            if(os.path.isfile(os.path.join(directory, path))):
                exec_not_on_path = False
                break

        if not os.path.isfile(path) and exec_not_on_path:
            raise Exception("Browsermob-Proxy binary couldn't be found in path"
                            " provided: %s" % path)

        self.path = path
        self.host = 'localhost'
        self.port = options.get('port', 8080)
        self.process = None

        if platform.system() == 'Darwin':
            self.command = ['sh']
        else:
            self.command = []
        self.command += [path, '--port=%s' % self.port]

    def start(self):
        """
        This will start the browsermob proxy and then wait until it can
        interact with it
        """
        self.log_file = open(os.path.abspath('server.log'), 'w')
        self.process = subprocess.Popen(self.command,shell=True,
                                        stdout=self.log_file,
                                        stderr=subprocess.STDOUT)
        count = 0
        while not self._is_listening():
            time.sleep(0.5)
            count += 1
            if count == 60:
                self.stop()
                raise Exception("Can't connect to Browsermob-Proxy")

    def stop(self):
        """
        This will stop the process running the proxy
        """
        self.command = "taskkill /im java.exe /f "
        try:
            
            print("Trying to kill server.")
            #subprocess.call(self.command)
            subprocess.Popen(self.command,shell=True,
                                        stdout=self.log_file,
                                        stderr=subprocess.STDOUT)
        except AttributeError:
            # kill may not be available under windows environment
            #os.system("taskkill /f /im java.exe")
            print('could not kill sever process')
            pass

        self.log_file.close()
