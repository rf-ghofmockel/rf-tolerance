# Module to get tolerances for defined standards

## Standards supported
- DIN13 (Norm für metrisches ISO Regelgewinde)
- DIN286 (IS0-Passungen)
- DIN2768 (Allgemeintoleranzen)

## Structure
- For each standard one function in index.js named ToleranceFor[Standardname]
- Data for the Standards is in folder 'Data', separated in different Folders named after the standard. 
In each folder one File for each type of Data named [Standardname][Meaning]Data.js, example DIN13TurningData.js
- In folder tests, create in file testCases.js one function for each standard for its tests.

## Hints
When an error occurs or the requested Parameters could not found in the Standard null will be returned.

 