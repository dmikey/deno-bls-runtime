# Makefile

# Define the compiler and the source file
DENO_COMPILER=~/.deno/bin/deno
SOURCE_FILE=src/index.ts
OUTPUT_FILE=bls-runtime

# Default target
all: compile

# Compile target
compile:
	$(DENO_COMPILER) compile --allow-all --output $(OUTPUT_FILE) $(SOURCE_FILE)

# Clean target
clean:
	rm -f $(OUTPUT_FILE)

# Help target
help:
	@echo "make - Compile the TypeScript file"
	@echo "make clean - Remove the compiled output"
	@echo "make help - Display this help message"
