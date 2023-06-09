import pandas as pd
import matplotlib.pyplot as plt

# Read the CSV file
df = pd.read_csv('battery_drainage.csv')

# Convert the 'Time' column to datetime format
df['Time'] = pd.to_datetime(df['Time'])

# Set the 'Time' column as the index
df.set_index('Time', inplace=True)

# Plotting the battery percentage over time
df['Percentage'].plot(kind='area', figsize=(10, 6), color='blue')

# Customize the plot
plt.title('Battery Drainage')
plt.xlabel('Time')
plt.ylabel('Percentage')
plt.grid(True)

# Display the plot
plt.show()
