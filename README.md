# NMSU Senior Project Spring 2018

### Authors: 
Cyrille Gindreau  
Luis M  Perez  
Tim Kraus
Alec Gonzales

### Dependencies
NodeJS 8.9.4  
https://nodejs.org/en/

### Setup
Clone repo: `git clone https://github.com/cyrillegin/seniorProject.git`  
Change into directory: `cd seniorProject`  
Run setup command: `npm run setup` 

### Production build
To create a development build:
`npm run startProd` - This will transpile and uglyify the project and start a server running on port 3000
To view the site, you can navigate to localhost:3000 in the web browser of your choosing.  
To run the application in electron, open a new terminal and run `npm run electron`.


### Development build
`npm run start` - This will transpile the project and start a development server running on port 3000. Automatic rebuilding will also be enabled so that you don't need to retranspile the entire project on every save.

##### Testing
`npm run test` Will run all of the linters and tests that are in the test folder.  
If you want to see coverage, run `npm run cover`. A coverage folder will be created with insights to how well your tests are preforming.

##### Misc
Stand in canoe taken from https://www.turbosquid.com/FullPreview/Index.cfm/ID/622136
