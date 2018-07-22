
var Network = function(trainingData, learningRate, outputInterval) {
    this.layers = [];

    this.trainingData = trainingData;
    this.learningRate = learningRate;
    this.outputInterval = outputInterval

    this.lastFullSet = "";
};

Network.prototype.runOnce = function() {
    for (var i = 0; i < this.layers.length; i++) {
        for (var j = 0; j < this.layers[i].length; j++) {
            this.layers[i][j].doMath();
        }
    }
};

Network.prototype.train = function(runs) {
    this.trainingIndex = 0;
    var runs = runs || 0;
    setTimeout(() => {
        var test = [];
        for (var i = 0; i < this.trainingData.length * this.outputInterval; i++) {
            this.trainingIndex = i % this.trainingData.length;
            for (var j = 0; j < this.trainingData[this.trainingIndex].inputs.length; j++) {
                this.layers[0][j].output = this.trainingData[this.trainingIndex].inputs[j];
            }
            
            this._trainOnce();
            
            test.push(this.layers[this.layers.length - 1][1].output);
        }

        this._storeOutput(runs, test);

        this.train(runs + this.outputInterval);
    }, 0);
};

Network.prototype._storeOutput = function(set, outputArr) {
    this.lastFullSet = "";
    this.lastFullSet += ("Run count: " + set + "<br><table><tr><th>Inputs</th><th>Expected</th><th>Actual</th></tr>");

    for (var i = 0; i < this.trainingData.length; i++) {
        this.lastFullSet += ("<tr><td>" + this.trainingData[i].inputs + "</td><td>" + this.trainingData[i].outputs + "</td><td>" + outputArr[i] + "</td></tr>")
    }
    this.lastFullSet += ("</table>");
};

Network.prototype.print = function() {
    document.getElementById("output").innerHTML = this.lastFullSet;
};

Network.prototype._trainOnce = function() {
    this.runOnce();

    // Calculate errors on output neurons
    var outputs = this.getOutputs();
    var pdOutputErrors = [];
    for (var i = 0; i < outputs.length; i++) {
        pdOutputErrors.push(outputs[i].calculatePDErrorWRTTotalInput(this.trainingData[this.trainingIndex].outputs[i]));
    }

    // Calculater errors on hidden layer neurons
    var errorsByLayer = [];
    errorsByLayer[this.layers.length - 1] = pdOutputErrors;
    for (var i = this.layers.length - 2; i >= 1; i--) {
        errorsByLayer[i] = [];
        for (var neuronIndex = 1; neuronIndex < this.layers[i].length; neuronIndex++) {
            var totalError = 0;

            for (var j = 1; j < this.layers[i + 1].length; j++) {
                totalError += errorsByLayer[i + 1][j - 1] * this.layers[i + 1][j].inputs[neuronIndex].weight;
            }

            errorsByLayer[i].push(totalError * this.layers[i][neuronIndex].calculatePDTotalNetInputWRTInput());
        }
    }

    // Update weights for everybody
    for (var i = this.layers.length - 1; i >= 1; i--) {
        for (var neuronIndex = 1; neuronIndex < this.layers[i].length; neuronIndex++) {
            for (var input = 0; input < this.layers[i][neuronIndex].inputs.length; input++) {
                var errorWRTWeight = errorsByLayer[i][neuronIndex - 1] * this.layers[i][neuronIndex].inputs[input].input.output;

                this.layers[i][neuronIndex].inputs[input].weight -= this.learningRate * errorWRTWeight;
            }
        }
    }
};

Network.prototype.calculateOutputError = function() {
    var outputs = this.getOutputs();
    var totalError = 0;
    for(var i = 0; i < outputs.length; i++) {
        totalError += outputs[i].calculateError(this.trainingData[this.trainingIndex].outputs[i]);
    }
    return totalError;
};

Network.prototype.addNeuron = function(neuron, layer) {
    if (this.layers[layer]) {
        this.layers[layer].push(neuron);
    } else {
        this.layers[layer] = [new Neuron(NeuronTypes.LOCKED, 1), neuron];
    }

    if (layer !== 0) {
        for (var i = 0; i < this.layers[layer - 1].length; i++) {
            neuron.addInput(this.layers[layer - 1][i]);
        }
    }

    if (this.layers[layer + 1] ){
        for (var i = 0; i < this.layers[layer + 1].length; i++) {
            this.layers[layer + 1][i].addInput(neuron);
        }
    }
};

Network.prototype.addInput = function(input) {
    var neuron = new Neuron(NeuronTypes.LOCKED, input);
    this.addNeuron(neuron, 0);
};

Network.prototype.getOutputs = function() {
    var outputs = [];
    for (var i = 1; i < this.layers[this.layers.length - 1].length; i++) {
        outputs.push(this.layers[this.layers.length - 1][i]);
    }
    return outputs;
};

Network.prototype.setTrainingData = function(trainingData) {
    this.trainingData = trainingData;
};