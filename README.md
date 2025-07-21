
# AI-NLP-ML-guide

This page helps you understand the definitions, mathematical, and computation process of the LLM.




## PROCESS

1. Setup: Vocabulary and Parameters
2. Weight Matrices Initialization
3. Training Pairs Generation (Window = 2)
4. Forward Pass: Processing

    i. One-Hot encoding

    ii. Word embedding
    
        h = W_in^T × x_c

    iii. Output score

        u = W_out^T × h
    iv. Softmax

            P(w_o | w_c) = exp(u_o) / Σ exp(u_w)
5. Loss Calculation/Gradient
        
        L = -log P(A | B)
6. Backward Propagation

    i. Output layer gradient

        ∂L/∂u = ŷ - y_true

    ii. Output weight gradient

        ∂L/∂W_out = h × (∂L/∂u)ᵀ

    iii. Hidden layer gradient

        ∂L/∂h = W_out × (∂L/∂u)

    iv. Input weight gradient

        ∂L/∂W_in = x_c × (∂L/∂h)ᵀ

7. Weight Update And Learning Rate

        W_new = W_old - α × ∂L/∂W

## Authors

- [@kshwedha](https://www.github.com/kshwedha)


## Contributing

Contributions are always welcome!

Please adhere to this project's `code of conduct`.

