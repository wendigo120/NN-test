
var i = 0;
var NeuronTypes = {
    LOCKED: i++, // Use locked neurons for inputs and biases
    STEP: i++,
    TANH: i++
};

var DeltaStep = 0.0001;

var Neuron = function(type, startOutput) {
    if (type !== NeuronTypes.LOCKED) {
        this.inputs = [{
            input: new Neuron(NeuronTypes.LOCKED, 1),
            weight: (Math.random() * 2) - 1,
        }];
    }
    this.type = type;
    this.output = startOutput || 0;
};

Neuron.prototype.addInput = function(input, weight) {
    this.inputs.push({
        input: input,
        weight: typeof weight == "number" ? weight : (Math.random() * 2) - 1
    })
};

Neuron.prototype.calculateDelta
Neuron.prototype.doMath = function() {
    switch (this.type) {
        case NeuronTypes.STEP: return this._stepFunction();
        case NeuronTypes.TANH: return this._tanhFunction();
        case NeuronTypes.LOCKED: return 0;
        case undefined: throw new Error("No neuron type defined");
    }
};

Neuron.prototype._stepFunction = function() {
    var sum = 0;
    for (var i = 0; i < this.inputs.length; i++) {
        sum += this.inputs[i].input.output * this.inputs[i].weight;
    }
    this.output = sum > 0 ? 1 : 0;
};

Neuron.prototype._tanhFunction = function() {
    var sum = 0;
    for (var i = 0; i < this.inputs.length; i++) {
        sum += this.inputs[i].input.output * this.inputs[i].weight;
    }
    this.output = (Math.tanh(sum) + 1) / 2;
};