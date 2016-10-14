# Electron Inserts Web App

The online web app is avialable at http://electrons.simonbiggs.net

## Description

This online web app is for the modelling of the portion of the electron output factor that is dependent on the shape of the shielding insert mounted within the applicator. This allows modelling insert factors using only the measured factors already available at a centre. Should all outliers be removed from the data set the user might expect as low as 0.5% standard uncertainty for factor prediction with as little as 8 data points.

The source code for web app is found in two parts:

 * Server -- https://github.com/SimonBiggs/electronfactor-server
 * Client -- https://github.com/SimonBiggs/electroninserts-webapp
 
The fundamental code from which all paremeterisation and modelling is done is found within the following python file:

 * https://github.com/SimonBiggs/electronfactor-server/blob/master/electroninserts.py

The paper outlining this method:

 > S. Biggs, M. Sobolewski, R. Murry, J. Kenny, Spline modelling electron insert factors using routine measurements. Physica Medica (2015), [doi:10.1016/j.ejmp.2015.11.002](http://dx.doi.org/10.1016/j.ejmp.2015.11.002).

If you have any issues or feedback please contact me at mail@simonbiggs.net.

Any use of the code accepts the AGPL3+ license which includes no warranty that this code is fit for a particular purpose. Attempts have been made to make the code transparent and it is recommended that an experienced python programmer and physicist who understands the procedure outlined in the paper and the requirements of your centre identifies whether or not this method and code is fit for your use.


## Copyright information
Copyright &#169; 2015  Simon Biggs

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
