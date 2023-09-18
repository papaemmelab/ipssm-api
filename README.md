<!-- badges: start -->
<!-- [![classification](https://github.com/papaemmelab/ipssm/actions/workflows/classification.yaml/badge.svg)](https://github.com/papaemmelab/ipssm/actions/workflows/classification.yaml) -->

<!-- [![R-CMD-check](https://github.com/papaemmelab/ipssm/actions/workflows/R-CMD-check.yaml/badge.svg)](https://github.com/papaemmelab/ipssm/actions/workflows/R-CMD-check.yaml) -->
<!-- badges: end -->

# ipssm

Javascript/Node Package for the Molecular International Prognostic Scoring System (IPSS-M) for Myelodysplastic Syndromes.

For the R package, see [papaemmelab/ipssm](https://github.com/papaemmelab/ipssm).

## :rocket: Installation instructions

```bash
# Using npm
npm install ipssm // TODO: deploy to npm

# Using github
git clone https://github.com/papaemmelab/ipssm-js.git
node index.js
```

# TODO: Replace all of this

## :boom: Usage

The worflow below consists of 4 simple steps, namely 1) Read your input data file and perform some validation on the data, 2) Process the variables in a suitable format for the model, 3) Calculate the IPSS-M risk score and risk category (under the best, mean, and worst scenario to account for missing data if there are some), 4) Annotate the results.

```R
# load the ipssm library
library("ipssm")
# path to your input data file
path.file <- system.file("extdata", "IPSSMexample.csv", package = "ipssm")
#path.file <- system.file("extdata", "IPSSMexample.xlsx", package = "ipssm") # equivalent

# 1) Read and Validate File
dd <- IPSSMread(path.file)

# 2) Process User Input Variables into Model Variables
dd.process <- IPSSMprocess(dd)

# 3) Calculate IPSS-M
dd.res <- IPSSMmain(dd.process)

# 4) Annotate Results
dd.annot <- IPSSMannotate(dd.res)
```

Alternatively the above steps can be performed with a one-line code using a wrapper function, as follows.

```R
# load the ipssm library
library("ipssm")
# path to your input data file
path.file <- system.file("extdata", "IPSSMexample.csv", package = "ipssm")

# call the IPSS-M wrapper function
ddall <- IPSSMwrapper(path.file)
```

## :page_with_curl: Reference

[Bernard E, Tuechler H, Greenberg PL, Hasserjian RP, Arango Ossa JE et al. **Molecular International Prognostic Scoring System for Myelodysplastic Syndromes**, *NEJM Evidence* 2022.](https://evidence.nejm.org/doi/full/10.1056/EVIDoa2200008)

## :four_leaf_clover: Other

In addition to the R package, you may be interested in checking out our [Online Web Calculator](https://mds-risk-model.com/) with [Juan E Arango Ossa](https://github.com/juanesarango) as main developer.


## :question: Question

Any questions feel free to contact [ElsaB](https://elsab.github.io/).
