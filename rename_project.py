import os
import re

directory = r"c:\AnganAI"

# 1. Delete problematic files
files_to_delete = [
    os.path.join(directory, "frontend", "src", "pages", "Attendance.jsx   "),
    os.path.join(directory, "frontend", "src", "pages", "Reports.jsx   ")
]

for f in files_to_delete:
    if os.path.exists(f):
        try:
            os.remove(f)
            print(f"Deleted: {f}")
        except Exception as e:
            print(f"Error deleting {f}: {e}")

# 2. Rename PoshanAI -> Nutrilytics
ignore_dirs = {'.git', 'node_modules', '__pycache__', 'venv', '.venv'}
ignore_exts = {'.db', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.pyc'}

for root, dirs, files in os.walk(directory):
    # modify dirs in place to skip ignored directories
    dirs[:] = [d for d in dirs if d not in ignore_dirs]
    
    for file in files:
        if any(file.endswith(ext) for ext in ignore_exts):
            continue
            
        filepath = os.path.join(root, file)
        
        # Don't process this script
        if file == "rename_project.py":
            continue
            
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            # Replacements
            content = content.replace("PoshanAI", "Nutrilytics")
            content = content.replace("poshanAI", "Nutrilytics")
            content = content.replace("poshanai", "nutrilytics")
            
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated: {filepath}")
        except UnicodeDecodeError:
            pass # Skip binary files
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

# Rename the db file if it exists
old_db = os.path.join(directory, "poshanai.db")
new_db = os.path.join(directory, "nutrilytics.db")
if os.path.exists(old_db):
    try:
        os.rename(old_db, new_db)
        print(f"Renamed {old_db} to {new_db}")
    except Exception as e:
        print(f"Error renaming {old_db}: {e}")

