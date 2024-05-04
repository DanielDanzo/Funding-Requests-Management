import subprocess

def test_math():
    # Run Jest to test math.js and generate coverage report
    result = subprocess.run('npx jest --coverage', capture_output=True, text=True, shell=True)
    
    # Check if Jest exited successfully
    assert result.returncode == 0, f"Jest failed: {result.stderr}"

    # Print Jest output
    print(result.stdout)

if __name__ == "__main__":
    test_math()
