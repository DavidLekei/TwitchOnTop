let mockxhr = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      onreadystatechange: jest.fn(),
      send: jest.fn(),
      readyState: 4,
      responseText: OAUTH_TOKEN,
      status: 200
    }