const commands = [
    "sudo apt-get update -y && sudo apt-get upgrade -y && sudo apt-get dist-upgrade -y",
    "npm install --global typescript webpack webpack-cli nodemon express mongoose",
    "pip install --upgrade pip setuptools wheel virtualenv && python setup.py install",
    "git clone https://github.com/some/repo.git && cd repo && npm install && npm run build",
    "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash",
    "docker pull nginx:latest && docker run --name webserver -p 80:80 -d nginx",
    "sudo systemctl restart apache2 && sudo systemctl enable apache2 && sudo systemctl status apache2",
    "sudo apt-get install build-essential libssl-dev && sudo make install",
    "yum install -y httpd mysql-server && systemctl start httpd && systemctl enable mysql",
    "sudo apt-get install openjdk-11-jdk maven gradle && mvn clean install && gradle build",
    "wget https://some-large-file.com/file.tar.gz && tar -xvzf file.tar.gz && cd file && ./configure",
    "scp user@remote:/path/to/dir/* /local/path/ && rsync -avz /source/dir/ /destination/dir/",
    "npm install --save-dev jest eslint prettier husky lint-staged && npx jest --watchAll",
    "python -m venv env && source env/bin/activate && pip install -r requirements.txt",
    "kubectl apply -f deployment.yaml && kubectl get pods && kubectl logs -f podname",
    "sudo apt-get install nodejs npm && npm init -y && npm install express && node server.js",
    "sudo dnf update && sudo dnf install python3-pip && pip3 install flask django requests",
    "docker-compose up -d && docker-compose exec app bash && docker-compose down",
    "brew install node python docker && brew cleanup && brew doctor",
    "git fetch --all && git reset --hard origin/main && git pull && git merge feature-branch",
    "mkdir -p /usr/local/sbin && chmod +x /usr/local/sbin && cp script.sh /usr/local/sbin/script",
    "apt-get autoremove && apt-get autoclean && apt-get check && apt-get install htop",
    "chmod 755 /var/www/html && chown -R www-data:www-data /var/www && systemctl reload apache2",
    "python manage.py makemigrations && python manage.py migrate && python manage.py runserver",
    "npm install -g create-react-app && create-react-app myapp && cd myapp && npm start"
  ];
  
  // ANSI escape code for green text
  const green = '\x1b[32m';
  const reset = '\x1b[0m';
  
  // Fake outputs to simulate command processing
  const fakeOutputs = [
    "Reading package lists... Done",
    "Building dependency tree... Done",
    "Calculating upgrade... Done",
    "Fetched X packages in Y seconds",
    "Installing new packages: A, B, C...",
    "Removing packages: D, E...",
    "Successfully installed XYZ version 1.2.3",
    "Cloning into 'repo'...",
    "Checking out files...",
    "Successfully installed dependencies.",
    "Progress: 50% [##################----------]  ETA: 1m 30s",
    "Success: All services are running.",
    "Error: Could not find package.",
    "Warning: Some packages could not be upgraded.",
    "Installation completed successfully.",
    "Done. Exiting..."
  ];
  
  // Function to display a loading animation
  function showLoader() {
    const loaderFrames = ['|', '/', '-', '\\'];
    let index = 0;
  
    const interval = setInterval(() => {
      process.stdout.write(`\rLoading... ${loaderFrames[index]}`);
      index = (index + 1) % loaderFrames.length;
    }, 50); // Faster loader interval (50ms)
  
    return interval;
  }
  
  // Function to clear the loader
  function clearLoader(interval) {
    clearInterval(interval);
    process.stdout.write('\r\n'); // Move to the next line
  }
  
  // Function to simulate command output
  function logFakeOutput() {
    const output = fakeOutputs[Math.floor(Math.random() * fakeOutputs.length)];
    console.log(`${green}${output}${reset}`);
  }
  
  function logRandomCommand() {
    const randomCommand = commands[Math.floor(Math.random() * commands.length)];
    console.log(`${green}${randomCommand}${reset}`); // Log command in green
    
    // Show loader while simulating command processing
    const loaderInterval = showLoader();
  
    // Simulate a delay for command processing (300-600ms)
    setTimeout(() => {
      clearLoader(loaderInterval);
      logFakeOutput(); // Log a fake output after command
      
      // Log a new random command faster (every 200-300ms)
      setTimeout(logRandomCommand, Math.random() * 100 + 200); // Random delay between 200 and 300ms
    }, Math.random() * 300 + 300); // Random delay between 300 and 600ms
  }
  
  console.log(`${green}Starting installation process...${reset}`); // Start message in green
  
  // Start logging commands
  logRandomCommand();
  